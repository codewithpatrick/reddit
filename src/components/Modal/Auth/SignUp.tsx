import { authModalState } from '@/src/atoms/authModalAtom';
import { auth, firestore } from '@/src/firebase/clientApp';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import { Auth, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from '@/src/firebase/errors';
import { addDoc, collection } from 'firebase/firestore';

const SignUp = () => {
    const setAuthModalState = useSetRecoilState(authModalState);

    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");

    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError
    ] = useCreateUserWithEmailAndPassword(auth);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (error) setError("");

        if (signUpForm.password !== signUpForm.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const createUserDocument = async (user: User) => {
        await addDoc(collection(firestore, "users"), JSON.parse(JSON.stringify(user)));

        useEffect(() => {
            if (userCred) {
                createUserDocument(userCred.user);
            }
        }, [userCred]);
    }

    return (
        <form onSubmit={onSubmit}>
            <Input name="email"
                required
                placeholder="email"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{
                    color: "gray.500"
                }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                bg="gray.50" />
            <Input name="password"
                required
                placeholder="password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{
                    color: "gray.500"
                }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                bg="gray.50"
            />
            <Input name="confirmPassword"
                required
                placeholder="confirm password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{
                    color: "gray.500"
                }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                bg="gray.50"
            />
            {(error || userError) && (
                <Text textAlign="center" color="red" fontSize="10px">
                    {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
                </Text>
            )}
            <Button type="submit"
                width="100%"
                height="36px"
                mt={2}
                mb={2}
                isLoading={loading}>Sign Up</Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Already a reddittor?</Text>
                <Text color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() => {
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "login"
                        }))
                    }}>LOG IN</Text>
            </Flex>
        </form>
    )
}

export default SignUp;