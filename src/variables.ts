export const USED_AZURE_API = import.meta.env['VITE_USE_AZURE_API']
export const SUBSCRIPTION_KEY = import.meta.env['VITE_AZURE_SUBSCRIPTION_KEY']
export const BING_API_HOSTNAME = import.meta.env['VITE_BING_API_HOSTNAME']
export const BING_API_PATH = import.meta.env['VITE_BING_API_PATH']
export const CHATGPT_API_KEY = import.meta.env['VITE_CHATGPT_API_KEY']

validateVariables();
function validateVariables() {
    let app = document.getElementById('app');
    console.log(USED_AZURE_API)
    if (USED_AZURE_API === false) {
        if (!SUBSCRIPTION_KEY) {
            let header = document.createElement('h2');
            header.append("SUBSCRIPTION_KEY environmental variable is not set. (.env.local)");
            app?.appendChild(header);
            throw new Error('VITE_AZURE_SUBSCRIPTION_KEY environmental variable is not set.')
        }
        if (!BING_API_HOSTNAME) {
            let header = document.createElement('h2');
            header.append("BING_API_HOSTNAME environmental variable is not set. (.env.local)");
            app?.appendChild(header);
            throw new Error('VITE_BING_API_HOSTNAME environmental variable is not set.')
        }
        if (!BING_API_PATH) {
            let header = document.createElement('h2');
            header.append("BING_API_PATH environmental variable is not set. (.env.local)");
            app?.appendChild(header);
            throw new Error('VITE_BING_API_PATH environmental variable is not set.')
        }
    }
    if (!CHATGPT_API_KEY) {
        let header = document.createElement('h2');
        header.append("VITE_CHATGPT_API_KEY environmental variable is not set. (.env.local)");
        app?.appendChild(header);
        throw new Error('VITE_CHATGPT_API_KEY environmental variable is not set.')
    }
}