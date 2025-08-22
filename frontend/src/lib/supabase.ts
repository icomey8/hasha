import { createClient } from "@supabase/supabase-js";
import { fetchAuthSession } from "aws-amplify/auth";

export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
	{
		auth: {
			persistSession: false,
		},
		accessToken: async () => {
			const tokens = await fetchAuthSession();
			return tokens?.tokens?.idToken?.toString() || null;
		},
	}
);
