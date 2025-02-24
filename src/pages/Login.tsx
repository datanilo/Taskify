// src/pages/Login.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/auth/contexts/useUserContext";

// Funciones de autenticación y traducción de errores
import { authenticateUser } from "@/auth/services/cognitoService";
import { translateCognitoError } from "@/auth/services/cognitoErrors";
// Función para obtener datos completos del usuario desde la DB
import { getUserData } from "@/services/apiService";

// Esquema de validación con zod
const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  remember: z.boolean().default(true),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const { setUser } = useUserContext();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });
  const navigate = useNavigate();

  // Función para autenticar al usuario y cargar los datos desde la DB
  const onSubmit = async (values: LoginFormValues) => {
    try {
      // Autenticación con Cognito
      const session = await authenticateUser(values.email, values.password);
      toast.success("Inicio de sesión exitoso");
      // Datos básicos provenientes de Cognito
      const basicUser = {
        id: session.getIdToken().payload.sub,
        name: session.getIdToken().payload.name,
        email: session.getIdToken().payload.email,
        avatarUrl: session.getIdToken().payload.picture || "",
      };

      // Cargar la información completa desde la base de datos
      try {
        const response = await getUserData(basicUser.id);
        const completeUserData = response.data;

        setUser(completeUserData);
        localStorage.setItem("user", JSON.stringify(completeUserData)); // Guardar en localStorage
      } catch (dbError: any) {
        console.error("Error fetching user data from DB:", dbError);
        setUser(basicUser);
        localStorage.setItem("user", JSON.stringify(basicUser)); // Guardar en localStorage
      }

      navigate("/");
    } catch (err: any) {
      toast.error(translateCognitoError(err.message));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-full max-w-[350px] space-y-6">
        <h1 className="text-2xl font-semibold text-center mb-10">Inicia sesión</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Correo electrónico"
                        type="email"
                        className="h-12 px-4 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Contraseña"
                        type="password"
                        className="h-12 px-4 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-[#0066FF] data-[state=checked]:bg-[#0066FF]"
                    />
                  </FormControl>
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Acuérdate de mí
                  </Label>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-medium"
            >
              Ingresar
            </Button>
          </form>
        </Form>

        <div className="space-y-6 text-center">
          <a className="text-[#0066FF] hover:underline text-sm">
            ¿Has olvidado tu contraseña?
          </a>

          <div className="space-y-2 mt-20">
            <p className="text-gray-600">¿Nuevo en Taskify?</p>
            <a onClick={() => navigate("/register")} className="text-[#0066FF] hover:underline font-medium">
              ¡Regístrate!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
