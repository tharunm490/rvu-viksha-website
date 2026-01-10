import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";

type GoogleUserPayload = {
    email: string;
    given_name?: string;
    family_name?: string;
    sub: string;
    picture?: string;
};

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    message: string;
};

export default function ContactForm() {
    const { toast } = useToast();
    const [googleToken, setGoogleToken] = useState<string | null>(null);
    const [user, setUser] = useState<GoogleUserPayload | null>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>();

    // Mutation to handle form submission to the backend API
    const submitMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (!googleToken || !recaptchaToken) throw new Error("Authentication missing");
            return apiRequest("POST", "/api/contact", { ...data, googleToken, recaptchaToken });
        },
        onSuccess: () => {
            toast({
                title: "Message Sent Successfully!",
                description: "Thank you for reaching out. We will get back to you shortly.",
                className: "bg-green-400 text-black border-green-500",
            });
            reset();
            setRecaptchaToken(null);
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to send message. Please try again.",
                variant: "destructive",
            });
        }
    });

    // Decodes Google credential and updates form state
    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            setGoogleToken(credentialResponse.credential);
            try {
                const decoded = jwtDecode<GoogleUserPayload>(credentialResponse.credential);
                setUser(decoded);
                setValue("email", decoded.email);
                if (decoded.given_name) setValue("firstName", decoded.given_name);
                if (decoded.family_name) setValue("lastName", decoded.family_name);
                toast({ title: "Signed in as " + decoded.email });
            } catch (e) {
                console.error("Token decode failed", e);
                toast({ title: "Login Error", variant: "destructive" });
            }
        }
    };

    // Validates presence of auth tokens before triggering mutation
    const onSubmit = (data: FormData) => {
        if (!googleToken || !recaptchaToken) {
            toast({ title: "Required", description: "Complete auth and captcha.", variant: "destructive" });
            return;
        }
        submitMutation.mutate(data);
    };

    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    if (!user) {
        return (
            <div className="relative bg-[#0a0a0a] p-8 sm:p-10 text-center mx-auto max-w-xl rounded-none shadow-2xl">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white" />
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white tracking-[0.2em] uppercase">Login Required</h3>
                        <div className="w-16 h-1 bg-white mx-auto shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        <p className="text-white opacity-90">
                            Please sign in with your Google account to send a message.
                        </p>
                    </div>

                    <div className="relative z-10 flex justify-center py-2">
                        <div className="transform scale-110 hover:scale-125 transition-transform duration-300">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast({ title: "Login Failed", variant: "destructive" })}
                                theme="outline"
                                shape="pill"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-[#0a0a0a] p-5 sm:p-6 mx-auto max-w-2xl rounded-3xl border border-white/10 shadow-2xl">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                <h3 className="text-lg font-bold text-white tracking-widest uppercase">Contact Us</h3>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 max-w-full overflow-hidden">
                    {user.picture ? (
                        <img src={user.picture} alt="" className="w-8 h-8 rounded-full ring-1 ring-white/20 shrink-0" />
                    ) : (
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
                            {user.given_name?.[0]}
                        </div>
                    )}
                    <span className="text-sm text-white font-mono truncate">{user.email}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white uppercase text-xs tracking-widest font-bold">First Name *</Label>
                        <Input
                            id="firstName"
                            {...register("firstName", { required: "Required" })}
                            className="bg-transparent border-white rounded-xl text-white focus:ring-1 focus:ring-white h-12 px-4"
                            placeholder="John"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white uppercase text-xs tracking-widest font-bold">Last Name *</Label>
                        <Input
                            id="lastName"
                            {...register("lastName", { required: "Required" })}
                            className="bg-transparent border-white rounded-xl text-white focus:ring-1 focus:ring-white h-12 px-4"
                            placeholder="Doe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white uppercase text-xs tracking-widest font-bold">Email</Label>
                    <Input id="email" {...register("email")} disabled className="bg-white/5 border-white/10 rounded-xl text-gray-400 h-12 px-4" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-white uppercase text-xs tracking-widest font-bold">Phone Number (Optional)</Label>
                    <Input id="phoneNumber" {...register("phoneNumber")} className="bg-transparent border-white rounded-xl text-white h-12 px-4" placeholder="+91" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message" className="text-white uppercase text-xs tracking-widest font-bold">Message *</Label>
                    <Textarea
                        id="message"
                        {...register("message", { required: "Required" })}
                        className="bg-transparent border-white rounded-xl text-white min-h-[120px] resize-none p-4"
                        placeholder="Transmission details..."
                    />
                </div>

                <div className="py-2">
                    {siteKey ? (
                        <div className="border border-white/10 p-2 inline-block">
                            <ReCAPTCHA sitekey={siteKey} onChange={setRecaptchaToken} theme="dark" />
                        </div>
                    ) : (
                        <div className="p-4 bg-red-900/20 border border-white/20 text-red-400 text-xs">ERR: siteKey missing</div>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={submitMutation.isPending || !recaptchaToken}
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold py-5 rounded-xl uppercase tracking-widest"
                >
                    {submitMutation.isPending ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>TRANSMITTING...</span>
                        </div>
                    ) : "Send Message"}
                </Button>
            </form>
        </div>
    );
}
