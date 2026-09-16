import { useSignIn } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/useRedux";
import { LoginSchema } from "@/services/validation/auth.signupValidation";
import { SignInType } from "@/typescript/interfaces/auth.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

function Login() {

  const dispatch = useAppDispatch()

  const {mutate:signIn,isPending} = useSignIn();
  const navigation = useRouter()


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInType) => {
    signIn(data,{
      onSuccess: (response) => {
        console.log("response",response)
        if(response.profileRole.user_role.member_type === "official"){
          navigation.push("/admin/dashboard");
        }
        else{
          navigation.push("/");
        }
      },
      onError: (error) => {
        console.error("Log in failed",error.message);
      }
    })
  }

  return (
    <div className="w-full h-full">
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col px-5">
            <label className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
              EMAIL
            </label>
            <input
              className={`w-full text-lg p-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-red-700 transition-shadow ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              placeholder="Enter your full name"
              {...register("email")}
            />
            <div className="min-h-6 mt-1">
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message as string}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col px-5 py-1">
            <label className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
              PASSWORD
            </label>
            <input
              className={`w-full text-lg p-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-red-700 transition-shadow ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              type="password"
              placeholder="Enter your full name"
              {...register("password")}
            />
            <div className="min-h-6 mt-1">
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message as string}
                </span>
              )}
            </div>
          </div>

          <div className="w-full px-5">
            <button
            type="submit"
            disabled={isPending}
            className={`${isPending && "bg-gray-600"} w-full text-lg text-white font-semibold bg-red-700 px-10 py-3 rounded-md hover:bg-red-800 transition-colors duration-300 shadow-md disabled:bg-red-400 disabled:cursor-not-allowed`}
          >
            Sign In
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
