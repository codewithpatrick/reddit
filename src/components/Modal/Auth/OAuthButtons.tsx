import { auth } from '@/src/firebase/clientApp';
import { Button, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const OAuthButtons = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    return (
        <Flex direction="column"
            width="100%"
            mb={4}>
            <Button variant="oath"
                mb={2}
                isLoading={loading}
                onClick={() => signInWithGoogle()}>
                <Image src="/images/googlelogo.png"
                    height="20px"
                    mr={4} />
                Continue with Google
            </Button>
            <Button variant="oath">Some Other Provider</Button>
            {error && <Text>{error.message}</Text>}
        </Flex>
    )
}

export default OAuthButtons