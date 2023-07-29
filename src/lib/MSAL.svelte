<script context="module">
	import * as msal from '@azure/msal-browser'
	import { PUBLIC_AZURE_AD_TENANT_ID, PUBLIC_AZURE_AD_CLIENT_ID  } from '$env/static/public';

	let signInType = 'redirect'
	export let accountId = ''
	export let token = ''

	const loginRequest = {
		scopes: ['User.Read'],
		cache: msal.CacheLookupPolicy.Default,
	}

	const msalConfig = {
		auth: {
			clientId: PUBLIC_AZURE_AD_CLIENT_ID,
			authority: `https://login.microsoftonline.com/${PUBLIC_AZURE_AD_TENANT_ID}`,
			redirectUri: 'http://localhost:5173/',
		},
		cache: {
			cacheLocation: 'sessionStorage', // This configures where your cache will be stored
			storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
		},
	}

	// @ts-ignore
	export const currentUser = msalConfig.accountId

	const msalInstance = new msal.PublicClientApplication(msalConfig)

	console.dir(msalInstance)

	msalInstance
		.handleRedirectPromise()
		.then(handleResponse)
		.catch((err) => {
			console.error(err)
		})

	export const acquireToken = async () => {
		const [account] = msalInstance.getAllAccounts()
		if (!account) throw new Error('The app is not authorized')
		const token = await msalInstance.acquireTokenSilent({
			account,
			scopes: [`${PUBLIC_AZURE_AD_CLIENT_ID}/.default`],
		})
		return token.accessToken
	}

	/**
	 * @param {{ account: msal.AccountInfo | null; } | null} resp
	 */
	function handleResponse(resp) {
		console.log('~handle redirect promise')
		let account = null
		if (resp !== null && resp.account !== null) {
			accountId = resp.account.homeAccountId
			msalInstance.setActiveAccount(resp.account)
			account = resp.account
			console.log('~something not null', { account, accountId })
		} else {
			// need to call getAccount here?
			const currentAccounts = msalInstance.getAllAccounts()
			console.log('~else, call getAccount', { account, currentAccounts })
			if (!currentAccounts || currentAccounts.length < 1) {
				return
			} else if (currentAccounts.length > 1) {
				// Add choose account code here
			} else if (currentAccounts.length === 1) {
				const activeAccount = currentAccounts[0]
				msalInstance.setActiveAccount(activeAccount)
				accountId = activeAccount.homeAccountId
				account = activeAccount
			}
		}

		return msalInstance.getAllAccounts()
	}

	export async function signIn() {
		console.log('test!!!!!!')
		if (signInType === 'popup') {
			return msalInstance
				.loginPopup(loginRequest)
				.then(handleResponse)
				.catch(function (error) {
					console.log(error)
				})
		} else if (signInType === 'redirect') {
			return msalInstance.loginRedirect(loginRequest)
		}
	}

	/**
	 * @param {string} interactionType
	 */
	export async function signOut(interactionType) {
		const logoutRequest = {
			account: msalInstance.getAccountByHomeId(accountId),
		}

		if (interactionType === 'popup') {
			msalInstance.logoutPopup(logoutRequest).then(() => {
				window.location.reload()
			})
		} else {
			msalInstance.logoutRedirect(logoutRequest)
		}
	}
</script>
