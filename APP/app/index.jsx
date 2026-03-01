import { Redirect } from "expo-router";

export default function Index() {
    // The actual routing logic between (auth) and (tabs) is handled in _layout.jsx
    // This file just serves as the initial entry point to prevent "Unmatched Route" errors in production.
    return <Redirect href="/(auth)/login" />;
}
