# Recipe Generator

## Setup

The following variables need to be set in a .env.local file (this file needs to be at the root directory of the project)

```
VITE_USE_AZURE_API=false
VITE_CHATGPT_API_KEY='YOUR KEY'
```

If you want to use the BING Api:
```
VITE_USE_AZURE_API=true
VITE_AZURE_SUBSCRIPTION_KEY='YOUR KEY'
VITE_BING_API_HOSTNAME='api.bing.microsoft.com'
VITE_BING_API_PATH='/v7.0/search?q='
VITE_CHATGPT_API_KEY=' '
```