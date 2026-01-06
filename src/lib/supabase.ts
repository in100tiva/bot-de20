/**
 * Cliente HTTP simples para consultar o Supabase GoDevs
 * Usa fetch nativo com timeout para garantir performance no Render
 */

interface GoDevsActivity {
  id: string;
  lesson_name: string;
  tipo_atividade: string;
  created_at: string;
  discord_id: string | null;
}

interface SupabaseResponse {
  activities: GoDevsActivity[];
  count: number;
  error: string | null;
}

const TIMEOUT_MS = 2000; // 2 segundos de timeout

/**
 * Busca atividades do GoDevs por Discord ID
 */
export async function fetchGoDevsActivities(discordId: string): Promise<SupabaseResponse> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      activities: [],
      count: 0,
      error: 'Variáveis SUPABASE_URL ou SUPABASE_ANON_KEY não configuradas',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(
      `${supabaseUrl}/rest/v1/submitted_activities?discord_id=eq.${discordId}&select=id,lesson_name,tipo_atividade,created_at,discord_id`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        activities: [],
        count: 0,
        error: `Erro HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const activities = (await response.json()) as GoDevsActivity[];

    return {
      activities,
      count: activities.length,
      error: null,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        activities: [],
        count: 0,
        error: 'Timeout ao conectar com o GoDevs (>2s)',
      };
    }
    return {
      activities: [],
      count: 0,
      error: `Erro ao conectar: ${error.message}`,
    };
  }
}

/**
 * Busca apenas a contagem de atividades (mais rápido)
 */
export async function fetchGoDevsActivityCount(discordId: string): Promise<{ count: number; error: string | null }> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      count: 0,
      error: 'Variáveis SUPABASE_URL ou SUPABASE_ANON_KEY não configuradas',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(
      `${supabaseUrl}/rest/v1/submitted_activities?discord_id=eq.${discordId}&select=id`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        count: 0,
        error: `Erro HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // O Supabase retorna a contagem no header quando usamos Prefer: count=exact
    const countHeader = response.headers.get('content-range');
    if (countHeader) {
      const match = countHeader.match(/\/(\d+)$/);
      if (match && match[1]) {
        return { count: parseInt(match[1], 10), error: null };
      }
    }

    // Fallback: contar itens retornados
    const data = await response.json();
    return { count: Array.isArray(data) ? data.length : 0, error: null };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { count: 0, error: 'Timeout ao conectar com o GoDevs (>2s)' };
    }
    return { count: 0, error: `Erro ao conectar: ${error.message}` };
  }
}

/**
 * Verifica se o Discord ID está cadastrado no GoDevs (profiles)
 */
export async function checkDiscordIdInGoDevs(discordId: string): Promise<{ exists: boolean; error: string | null }> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { exists: false, error: 'Variáveis Supabase não configuradas' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(
      `${supabaseUrl}/rest/v1/profiles?discord_id=eq.${discordId}&select=id`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { exists: false, error: `Erro HTTP ${response.status}` };
    }

    const data = await response.json();
    return { exists: Array.isArray(data) && data.length > 0, error: null };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { exists: false, error: 'Timeout ao conectar' };
    }
    return { exists: false, error: error.message };
  }
}

