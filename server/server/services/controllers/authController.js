import { sendEmail } from "../emailService.js";

export async function registerUser(req, res) {
    const { email } = req.body;

    // depois de criar usuário...
    await sendEmail(
        email,
        "Bem-vindo!",
        "<h1>Cadastro realizado com sucesso 🚀</h1>"
    );

    res.json({ message: "Usuário criado e e-mail enviado" });
}