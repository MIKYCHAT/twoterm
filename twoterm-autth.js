
/*
  TWOTERM shared authentication helper.
  Uses Supabase JS v2.
  Does not replace existing login code.
*/
(() => {
  "use strict";

  const SUPABASE_URL =
    "https://rhysucxztnjlskodkads.supabase.co";

  // Use the existing PUBLIC publishable key.
  // Never place a service-role key or secret key here.
  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_cFrF4JmuSfQvf064BoFG7A_Y8KfSnv4";

  if (!window.supabase) {
    console.error(
      "TWOTERM Auth: Supabase JS library is not loaded."
    );
    return;
  }

  if (
    !SUPABASE_PUBLISHABLE_KEY ||
    SUPABASE_PUBLISHABLE_KEY.includes("PASTE_YOUR")
  ) {
    console.error(
      "TWOTERM Auth: Add your existing public publishable key."
    );
    return;
  }

  // Reuse an existing client if the page has already created one.
  // This avoids creating multiple competing clients.
  let client = window.twotermSupabase || window.supabaseClient;

  if (!client) {
    client = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  window.twotermSupabase = client;

  const auth = {
    client,

    async getSession() {
      const { data, error } = await client.auth.getSession();

      if (error) throw error;
      return data.session;
    },

    async getUser() {
      const { data, error } = await client.auth.getUser();

      if (error) throw error;
      return data.user;
    },

    async requireLogin() {
      const session = await auth.getSession();

      if (!session) {
        const returnTo =
          location.pathname + location.search + location.hash;

        location.href =
          "index.html?next=" + encodeURIComponent(returnTo);

        return null;
      }

      return session.user;
    },

    onAuthChange(callback) {
      return client.auth.onAuthStateChange(
        (event, session) => callback(event, session)
      );
    }
  };

  window.TWOTERM_AUTH = auth;
})();
