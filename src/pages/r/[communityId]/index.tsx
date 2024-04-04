import { Community } from '@/src/atoms/communitiesAtom';
import CommunityNotFound from '@/src/components/Community/NotFound';
import { firestore } from '@/src/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react'
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
    communityData: Community;
}

const CommunityPage = ({ communityData }: CommunityPageProps) => {
    if (!communityData) {
        return <CommunityNotFound />
    }

    return (
        <div>Welcome to {communityData.id}</div>
    )
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const communityDocRef = doc(firestore, "communities", context.query.communityId as string);

        const communityDoc = await getDoc(communityDocRef);

        return {
            props: {
                communityData: communityDoc.exists()
                    ? JSON.parse(
                        safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
                    )
                    : ""
            }
        }
    } catch (error: any) {
        console.log("getServerSideProps error", error);
    }
}

export default CommunityPage;