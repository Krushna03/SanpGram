import { useInfiniteQuery, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserById, getUserPosts, getUsers, likePost, savePost, searchPosts, updatePost, updateUser } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'
import { signInAccount, signOutAccount } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys'
//Query and mutation Simplifying data fetching and mutation with benefits like chaching, infinite scroll... 

export const useCreateUserAccount = () => {
    return useMutation({
       mutationFn: (user: INewUser) => createUserAccount(user)
    })
}


export const useSigninAccount = () => {
   return useMutation({
      mutationFn: (user: {
         email: string; 
         password: string;
   }) => signInAccount(user),
   })
}


export const useSignOutAccount = () => {
   return useMutation({
      mutationFn: signOutAccount,
   })
}


export const useCreatePost = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
         })
      }
   })
}


export const useGetRecentPosts = () => {
    return useQuery({
       queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
       queryFn: getRecentPosts,
    })
}

export const useLikePost = () => {
   const queryClient = useQueryClient()

   return useMutation({
       mutationFn: ({ postId, likesArray} : {postId: string; likesArray: string[] }) => likePost(postId, likesArray),
       onSuccess: (data) => {
          queryClient.invalidateQueries({
             queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
          })
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
         })
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
         })
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
         })
       }
   })
}



export const useSavePost = () => {
   const queryClient = useQueryClient()

   return useMutation({
       mutationFn: ({ postId, userId} : {postId: string; userId: string }) => savePost(postId, userId),
       onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
         })
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
         })
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
         })
       }
   })
}



export const useDeleteSavedPost = () => {
   const queryClient = useQueryClient()

   return useMutation({
       mutationFn: ( savedRecordId: string) => deleteSavedPost(savedRecordId),
       onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
         })
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
         })
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
         })
       }
   })
}


export const useGetCurrentUser = () => {
     return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
     })
}




export const useGetPostById = (postId?: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
      queryFn: () => getPostById(postId),
      enabled: !!postId
      //This disables the refething of the post again as it disabled that post when a already the post gets fetched
   })
}



export const useGetUserPosts = (userId?: string) => {
   return useQuery({
     queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
     queryFn: () => getUserPosts(userId),
     enabled: !!userId,
   });
 };
 

 

export const useUpdatePost = () => {
   const queryClient = useQueryClient()

   return useMutation({
     mutationFn: (post: IUpdatePost) => updatePost(post),
     onSuccess: (data) => {
        queryClient.invalidateQueries({
           queryKey:[QUERY_KEYS.GET_POST_BY_ID, data.$id]
        })
     }
   })
}



export const useDeletePost = () => {
   const queryClient = useQueryClient()

   return useMutation({
     mutationFn: ({ postId, imageId }: { postId?: string, imageId: string }) => deletePost(postId, imageId),
     onSuccess: () => {
        queryClient.invalidateQueries({
           queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
        })
     }
   })
}


// export const useGetPosts = () => {
//    return useInfiniteQuery({
//       queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//       queryFn: ({ pageParam = 0 }) => getInfinitePosts({ pageParam }),
//       initialPageParam: 0,
//       getNextPageParam: (lastPage: any) => {
//         // If there's no data, there are no more pages.
//         if (lastPage && lastPage.documents.length === 0) {
//           return null;
//         }
  
//         // Use the $id of the last document as the cursor.
//         const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
//         return lastId;
//       },
//     });
// }


export const useGetPosts = () => {
   return useInfiniteQuery({
     queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
     queryFn: getInfinitePosts as any,
     getNextPageParam: (lastPage: any) => {
       if (lastPage && lastPage.documents.length === 0) {
         return null;
       }
       const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;
       return lastId;
     },
     initialPageParam: null,
   });
 };

// export const useGetPosts = () => {
//    return useInfiniteQuery({
//      queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//      queryFn: ({ pageParam = "" }) => getInfinitePosts({ pageParam }),
//      getNextPageParam: (lastPage, allPages) => {
//        if (!lastPage || !lastPage.documents || lastPage.documents.length === 0) {
//          return null;
//        }
 
//        const lastDocumentId = lastPage.documents[lastPage.documents.length - 1].$id;
//        return lastDocumentId;
//      },
//      initialPageParam: "",
//    });
//  };



export const useSearchPosts = (searchTerm: string) => {
   return useQuery({
     queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
     queryFn: () => searchPosts(searchTerm),
     enabled: !!searchTerm,
   });
 };



 export const useGetUserById = (userId: string) => {
   return useQuery({
     queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
     queryFn: () => getUserById(userId),
     enabled: !!userId,
   });
 };



 export const useUpdateUser = () => {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: (user: IUpdateUser) => updateUser(user),
     onSuccess: (data) => {
       queryClient.invalidateQueries({
         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
       });
       queryClient.invalidateQueries({
         queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
       });
     },
   });
 };



 export const useGetUsers = (limit?: number) => {
   return useQuery({
     queryKey: [QUERY_KEYS.GET_USERS],
     queryFn: () => getUsers(limit),
   });
 };
 