'use client';

import {signIn} from "next-auth/react"
import {Button} from './ui/button';
import Image from "next/image";

const OAuthSignInButton = ({ provider }: { provider:string }) => {

    return (
        <Button
            type="button"
            onClick={() => signIn(provider, {redirectTo: '/oauth-callback'})}
            className="p-0 bg-transparent rounded-full overflow-hidden w-[200px] h-[50px] cursor-pointer transition-all duration-300 focus:ring-0 focus:border-transparent hover:bg-transparent shadow-none flex items-center justify-center"
        >
            {
                provider === 'google' ? (
                    <Image
                        src="/google_button_light.svg"
                        alt="Google Sign-In"
                        width={200}
                        height={50}
                        className="w-full h-full object-contain "
                    />
                ):(
                    <Image
                        src="/github_light_button.svg"
                        alt="GitHub Sign-In"
                        width={200}
                        height={50}
                        className="w-full h-full object-contain "
                    />
                )
            }

        </Button>

    );
};

export default OAuthSignInButton;
