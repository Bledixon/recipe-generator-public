import { SUBSCRIPTION_KEY, BING_API_HOSTNAME, BING_API_PATH } from '../variables'

export async function bingWebSearch(query:string|number|boolean) {
    const response = await fetch(`https://${BING_API_HOSTNAME}${BING_API_PATH}${encodeURIComponent(query)}`, {
        headers: {
            'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
        }
    })

    console.log(response.json);
  }