import React from 'react'
import SearchInput from './SearchInput'
import { Flex, Image } from '@chakra-ui/react'
import RightContent from './RightContent/RightContent'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/src/firebase/clientApp'

const Navbar = () => {
    const [user, loading, error] = useAuthState(auth);

    return (
        <>
            <Flex bg="white" height="44px" padding="6px 12px">
                <Flex align="center">
                    <Image src="/images/redditFace.svg"
                        height="30px"
                        alt="" />
                    <Image src="/images/redditText.svg"
                        height="46px"
                        display={{ base: "none", md: "unset" }}
                        alt="" />
                </Flex>
                <SearchInput />
                <RightContent user={user} />
            </Flex>
        </>
    )
}

export default Navbar;