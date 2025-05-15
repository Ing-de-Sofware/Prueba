export const createMockSupabaseClient = () => {
  return {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      admin: {
        deleteUser: jest.fn()
      }
    },
    storage: {
      createBucket: jest.fn(),
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
      remove: jest.fn(),
      listBuckets: jest.fn()
    }
  };
};