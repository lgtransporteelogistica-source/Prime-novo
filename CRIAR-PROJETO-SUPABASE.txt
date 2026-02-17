========================================
  CRIAR PROJETO NO SUPABASE (DO ZERO)
========================================

Siga cada passo. No final você terá um projeto e a URL + chave para colocar na Vercel.

----------------------------------------
PASSO 1 – ENTRAR NO SITE E CRIAR CONTA
----------------------------------------

1. Abra o navegador e acesse:  https://supabase.com

2. Clique no botão verde "Start your project".

3. Crie a conta:
   • "Sign in with GitHub" (se você tem GitHub) – é o mais rápido
   OU
   • "Sign up with email" – coloque e-mail e senha e confirme no e-mail

4. Depois de logar, você verá o painel do Supabase (Dashboard).

----------------------------------------
PASSO 2 – CRIAR UM NOVO PROJETO
----------------------------------------

1. Clique no botão verde "New Project".

2. Se pedir, escolha sua "Organization" (pode ser seu usuário mesmo). Next.

3. Preencha:
   • Name:  prime-group
          (ou outro nome, sem espaços)
   • Database Password:  crie uma senha forte e ANOTE em algum lugar.
     (Ex.: MinHaS3nhaSupabase2024!)
     Você usa essa senha só para acessos avançados ao banco.
   • Region:  South America (São Paulo)
          (deixe São Paulo para ficar mais rápido no Brasil)

4. Clique em "Create new project".

5. Aguarde 1 a 2 minutos. A página vai carregar até aparecer "Project is ready".

----------------------------------------
PASSO 3 – CRIAR AS TABELAS (RODAR AS MIGRATIONS)
----------------------------------------

1. No menu da ESQUERDA, clique em "SQL Editor" (ícone de </>).

2. Clique em "+ New query" (canto superior direito).

3. No seu computador, abra a pasta do projeto Prime Group:
   C:\Users\USER\Desktop\Nova pasta\prime-projeto-main\prime-projeto-main

4. Abra a pasta "supabase", depois "migrations".

5. Abra o arquivo:  00001_initial_schema.sql
   • Selecione tudo (Ctrl+A) e copie (Ctrl+C).
   • Volte ao navegador no Supabase, clique dentro da caixa de texto do SQL Editor e cole (Ctrl+V).
   • Clique no botão "Run" (ou aperte Ctrl+Enter).
   • Deve aparecer "Success. No rows returned" em verde.

6. Apague o texto do editor (Ctrl+A, Delete). Repita o processo para os outros 3 arquivos, NA MESMA ORDEM:
   • 00002_daily_routes_avaria.sql
   • 00003_fixed_expenses_dia_vencimento.sql
   • 00004_driver_locations.sql
   Cada um: abrir arquivo → copiar tudo → colar no SQL Editor → Run.

7. Se os 4 rodaram sem erro, sua base está pronta.

----------------------------------------
PASSO 4 – COPIAR A URL E A CHAVE (PARA A VERCEL)
----------------------------------------

1. No menu da ESQUERDA, clique na engrenagem: "Project Settings".

2. No submenu, clique em "API".

3. Na página você verá:
   • Project URL
     Clique no ícone de copiar ao lado. Guarde em um bloco de notas (ex.: https://abcdefghijk.supabase.co).
   • Project API keys
     Procure a chave "anon" "public". É uma chave longa que começa com eyJ...
     Clique em "Reveal" se estiver escondida e depois no ícone de copiar.
     NÃO use a chave "service_role" (é secreta).

4. Você agora tem:
   – Project URL (para VITE_SUPABASE_URL na Vercel)
   – Chave anon public (para VITE_SUPABASE_ANON_KEY na Vercel)

----------------------------------------
PRÓXIMO PASSO (DEPOIS DE CRIAR O PROJETO)
----------------------------------------

Abra o arquivo  APP-ONLINE-COM-BASE-DE-DADOS.txt  e siga a PARTE 2:
colocar essas duas informações na Vercel (Environment Variables) e fazer Redeploy.

========================================

RESUMO:
1. supabase.com → Start your project → criar conta
2. New Project → nome, senha, região São Paulo → Create
3. SQL Editor → New query → rodar os 4 arquivos da pasta supabase/migrations (copiar e colar cada um, Run)
4. Project Settings > API → copiar Project URL e anon public
5. Usar na Vercel (ver APP-ONLINE-COM-BASE-DE-DADOS.txt)

========================================
