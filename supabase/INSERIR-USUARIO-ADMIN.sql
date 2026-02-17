-- Cole no SQL Editor do Supabase e rode UMA VEZ.
-- Troque o email e a senha pelos que você quiser usar para logar.

INSERT INTO users (id, nome, email, senha, perfil, ativo, permissoes)
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@prime.com',
  'admin123',
  'admin',
  true,
  '[]'::jsonb
);

-- Depois de rodar: faça login no app com email "admin@prime.com" e senha "admin123"
-- (ou altere os valores acima antes de rodar e use os que você escolher)
