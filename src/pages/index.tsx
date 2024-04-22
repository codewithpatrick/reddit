import { Inter } from "@next/font/google";
import PageContent from "../components/Layout/PageContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import usePosts from "../hooks/usePosts";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Post } from "../atoms/postsAtom";
import PostLoader from "../components/Posts/PostLoader";
import { Stack } from "@chakra-ui/react";
import PostItem from "../components/Posts/PostItem";
import CreatePostLink from "../components/Community/CreatePostLink";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const communityStateValue = useRecoilValue(communityState);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();

  const buildUserHomeFeed = () => {};

  const buildNoUserHomeFeed = async () => {
    setLoading(true);

    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("buildNoUserHomeFeed error", error);
    }

    setLoading(false);
  };

  const getUserPostVotes = () => {};

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <></>
    </PageContent>
  );
}
