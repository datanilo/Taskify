// src/pages/Register.tsx
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/auth/contexts/useUserContext";

// Funciones de la API para crear el registro y obtener datos completos del usuario
import { createUserRecord, getUserData } from "@/services/apiService";

// Funciones centralizadas para Cognito
import {
  signUpUser,
  confirmUserRegistration,
  authenticateUser,
} from "@/auth/services/cognitoService";
import { translateCognitoError } from "@/auth/services/cognitoErrors";

// Esquema de validación con zod
const formSchema = z
  .object({
    fullName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().email({ message: "Por favor ingrese un correo electrónico válido." }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const { setUser } = useUserContext();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Estados para manejar el flujo de registro y confirmación
  const [cognitoUser, setCognitoUser] = useState<any>(null);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [tempCredentials, setTempCredentials] = useState<{ username: string; password: string } | null>(null);
  const navigate = useNavigate();

  // Registro inicial del usuario en Cognito
  const onSubmit = async (values: RegisterFormValues) => {
    const { fullName, email, password } = values;
    // Normalizamos el nombre para generar un username sin espacios y en minúsculas
    const username = fullName.trim().replace(/\s+/g, "").toLowerCase();
    try {
      const user = await signUpUser(username, password, fullName, email);
      setCognitoUser(user);
      setTempCredentials({ username, password });
      toast.success("Registro exitoso. Por favor, ingresa el código de confirmación.");
    } catch (err: any) {
      toast.error(translateCognitoError(err.message));
    }
  };

  // Confirmación del registro, autenticación y actualización del contexto
  const onConfirm = async () => {
    if (!cognitoUser || !tempCredentials) return;

    try {
      await confirmUserRegistration(cognitoUser, confirmationCode);
      const session = await authenticateUser(tempCredentials.username, tempCredentials.password);
      toast.success("Usuario confirmado y autenticado");

      // Datos básicos del usuario provenientes del token
      const basicUser = {
        id: session.getIdToken().payload.sub,
        name: session.getIdToken().payload.name,
        email: session.getIdToken().payload.email,
        avatarUrl: `https://unavatar.io/${session.getIdToken().payload.email}` || "",
      };

      let updatedUser = basicUser;

      // Almacenar el token de Cognito
      const idToken = session.getIdToken().getJwtToken();
      localStorage.setItem("cognitoToken", idToken);


      try {
        const { data } = await createUserRecord({
          id: basicUser.id,
          name: basicUser.name,
          email: basicUser.email,
          avatarUrl: basicUser.avatarUrl,
          lists: [
            {
              id: "1",
              name: "Tareas",
              tasks: [
                {
                  id: "1",
                  title: "Reservar hotel",
                  completed: false,
                  starred: false,
                  createdAt: new Date().toISOString(),
                  addedToMyDay: true,
                },
                {
                  id: "2",
                  title: "Comprar boletos de avión",
                  completed: false,
                  starred: true,
                  createdAt: new Date().toISOString(),
                  addedToMyDay: false,
                },
              ],
            },
          ],
          sharedLists: [
            {
              id: "1",
              name: "Viaje vacacional",
              sharedWith: {
                id: "1",
                name: "Ana García",
                email: "exmple@example.com",
                avatarUrl: "https://i.pravatar.cc/200",
              },
              tasks: [
                {
                  id: "1",
                  title: "Reservar Hotel",
                  completed: false,
                  starred: true,
                  createdAt: new Date().toISOString(),
                  addedToMyDay: false,
                },
                {
                  id: "2",
                  title: "Comprar boletos de avión",
                  completed: false,
                  starred: false,
                  createdAt: new Date().toISOString(),
                  addedToMyDay: true,
                },
                {
                  id: "3",
                  title: "Alistar maletas",
                  completed: true,
                  starred: false,
                  createdAt: new Date().toISOString(),
                  addedToMyDay: true,
                },
              ],
            },
          ],
          notifications: [
            {
              id: "1",
              title: "¡Bienvenido a Taskify!",
              description: "Empieza a organizar tus tareas y listas de forma sencilla.",
              read: false,
              createdAt: new Date().toISOString(),
            },
          ],
        });

        if (data.message === "Usuario creado correctamente") {
          updatedUser = (await getUserData(basicUser.id)).data
        } else {
          console.error("Error al crear el registro del usuario en la DB:", data.message);
        }

      } catch (apiError: any) {
        console.error("Error al crear el registro del usuario en la DB:", apiError);
      }

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/");

    } catch (err: any) {
      toast.error(translateCognitoError(err.message));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-full max-w-[350px] space-y-6">
        {!cognitoUser ? (
          <>
            <h1 className="text-2xl font-semibold text-center mb-10">Crea tu cuenta</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Nombre de usuario" className="h-12 px-4 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Correo electrónico" type="email" className="h-12 px-4 rounded-lg" {...field} />
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
                        <Input placeholder="Contraseña" type="password" className="h-12 px-4 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Confirmar contraseña" type="password" className="h-12 px-4 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-12 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-medium mt-6">
                  Crear cuenta
                </Button>
              </form>
            </Form>

            <div className="text-center space-y-2 mt-20">
              <p className="text-gray-600">¿Ya tienes cuenta?</p>
              <a onClick={() => navigate("/login")} className="text-[#0066FF] hover:underline font-medium">
                ¡Inicia Sesión!
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-center mb-10">Confirmar cuenta</h1>
            <p className="text-center">Ingresa el código de confirmación enviado a tu correo.</p>
            <Input
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Código de confirmación"
              className="h-12 px-4 rounded-lg"
            />
            <Button onClick={onConfirm} className="w-full h-12 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-medium mt-6">
              Confirmar cuenta
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
