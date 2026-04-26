import { z } from "zod";
export const registerBodySchema = z.object({
  firstName: z.string().min(3, "Le prénom doit faire minimum 3 caractère"),
  lastName: z.string().min(3, "Le nom doit faire minimum 3 caractère"),
  email: z.email("Entrez un email valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
    .nonempty("Entrez un mot de passe"),
  roleId: z.string("Le role id doit être sous forme uuid"),
});
