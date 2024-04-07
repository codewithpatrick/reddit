import { Community } from "@/src/atoms/communitiesAtom";
import { Post } from "@/src/atoms/postsAtom";
import { auth, firestore } from "@/src/firebase/clientApp";
import usePosts from "@/src/hooks/usePosts";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";

type PostsProps = {
  communityData: Community;
};

const Posts = ({ communityData }: PostsProps) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();

  const getPosts = async () => {
    setLoading(true);

    try {
      // get posts for this community
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);

      // store in post state
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Stack>
      {postStateValue.posts.map((item) => (
        <PostItem
          key={item.id}
          post={item}
          userIsCreator={user?.uid === item.creatorId}
          userVoteValue={undefined}
          onVote={onVote}
          onSelectPost={onSelectPost}
          onDeletePost={onDeletePost}
        />
      ))}
    </Stack>
  );
};

export default Posts;
