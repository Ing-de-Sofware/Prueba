import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageFile } from '../../domain/models/storage-file.model';
import { StorageRepository } from 'src/storage/domain/repositories/storage-repository.interface';
import { Database } from '../../../types/supabase';

@Injectable()
export class SupabaseStorageRepository implements StorageRepository {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are missing. Please check your environment variables.');
    }
    
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  async createBucket(bucketName: string, isPublic: boolean): Promise<void> {
    // Verificar si el bucket ya existe
    const { data: buckets } = await this.supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await this.supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 1024 * 1024 * 5,
      });
      
      if (error) {
        throw new Error(`Error al crear bucket: ${error.message}`);
      }
    }
  }
  async uploadFile(
    bucketName: string,
    filePath: string,
    file: Buffer,
    contentType: string
  ): Promise<StorageFile> {
    // Validar que el buffer existe y no está vacío
    if (!file) {
      throw new Error('Buffer de archivo no proporcionado');
    }
    
    if (!Buffer.isBuffer(file)) {
      throw new Error('El parámetro file debe ser un Buffer');
    }
    
    if (file.length === 0) {
      throw new Error('El buffer del archivo está vacío');
    }

    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType,
        upsert: true,
      });
    
    if (error) {
      throw new Error(`Error al subir archivo: ${error.message}`);
    }
    
    // Obtener la URL del archivo
    const { data: urlData } = this.supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    // Obtener metadatos del archivo recién subido
    const fileName = filePath.split('/').pop() || '';
    
    return new StorageFile({
      path: filePath,
      url: urlData.publicUrl,
      size: file.length, // Ahora sabemos que file existe y es un Buffer
      mimeType: contentType,
      name: fileName,
      bucket: bucketName,
      contentType,
      createdAt: new Date(),
    });
  }

  async getFileUrl(bucketName: string, filePath: string): Promise<string> {
    const { data } = this.supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  async deleteFile(bucketName: string, filePath: string): Promise<boolean> {
    const { error } = await this.supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      throw new Error(`Error al eliminar archivo: ${error.message}`);
    }
    
    return true;
  }
}