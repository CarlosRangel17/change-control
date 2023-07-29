// // import { OMDB_API_KEY } from '$env/static/private';
// import { fail, json } from '@sveltejs/kit';
// import { PUBLIC_ORG_NAME, PUBLIC_PROJECT_NAME } from '$env/static/public'
// import { PAT_TOKEN } from '$env/static/private'

// const ADO_WORK_ITEM_URL = `https://dev.azure.com/${PUBLIC_ORG_NAME}/${PUBLIC_PROJECT_NAME}/_apis/wit/wiql?api-version=6`
// const ADO_STORY_URL = `https://projects-mfrm.visualstudio.com/${PUBLIC_PROJECT_NAME}/_workitems/edit/`

// type Field = {
//   "System.Title": string
// }
// type WorkItemDetail = {
//   id: number
//   rev: number
//   fields: Field
// }

// type WorkItem = {
//   id: number
//   url: string
// }

// type ADOWorkItemResponse = {
//   queryType: string // 'flat',
//   queryResultType: string // 'workItem',
//   asOf: string // '2023-07-27T18:46:46.64Z',
//   columns: { referenceName: string, name: string, url: string }[]
//   workItems: WorkItem[]
// }

// function generateQuery(tags: string) {
//   const tagList = tags.split(',');
//   const conditions = tagList.map((tag) => `[Tags] CONTAINS '${tag.trim()}'`).join(' OR ');
//   const query = `SELECT [State], [Title] FROM WorkItems WHERE ${conditions}`;
//   // `SELECT [State], [Title] FROM WorkItems WHERE [Tags] CONTAINS '${tags}'`
//   return query;
// }

// export async function POST({ request }: { request: { tags: string } }) {
  
//   try {
//     const { tags = 'Rel 07.26.23' } = request
//     const query = generateQuery(tags)
    
//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", `Basic ${btoa(`:${PAT_TOKEN}`)}`);
//     myHeaders.append("Content-Type", "application/json");
//     const rawBody = JSON.stringify({ query });

//     const requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: rawBody
//     };

//     const response = await fetch(ADO_WORK_ITEM_URL, requestOptions)
//     if (response.ok) {
//       const { workItems = [] }: ADOWorkItemResponse = await response.json() || {};

//       let requests: Promise<Response>[] = []
//       workItems?.forEach(({ url }) => requests.push(fetch(url, { ...requestOptions, method: 'GET', body: undefined }) as unknown as Promise<Response>))
      
//       let userStories: { id: number; title: string; url: string; }[] = []
//       await Promise.all(requests)
//         .then((responses) => {
//           return Promise.all(responses.map((response) => response.json()))
//         })
//         .then((workItemDetail) => {
//           userStories = workItemDetail.map(({ id, fields }) => ({
//             id,
//             title: fields['System.Title'],
//             url: `${ADO_STORY_URL}${id}`
//           }))
//         })
//         .catch((error) => {
//           console.error('~[getUserStories] error', error?.message)
//         })
//       return json(userStories);
//     }

//     return fail(500, { message: 'Failed to fetch user stories' });
//   } catch (error: any) {
//     return fail(500, { message: `Something went wrong. Please see error for more details: ${error?.message}` });
//   }
// }

// *************************************************************************************************************************
// import { json } from '@sveltejs/kit';
// import { PUBLIC_ORG_NAME, PUBLIC_PROJECT_NAME } from '$env/static/public';
// import { PAT_TOKEN } from '$env/static/private';

// const ADO_WORK_ITEM_URL = `https://dev.azure.com/${PUBLIC_ORG_NAME}/${PUBLIC_PROJECT_NAME}/_apis/wit/wiql?api-version=6`;
// const ADO_STORY_URL = `https://projects-mfrm.visualstudio.com/${PUBLIC_PROJECT_NAME}/_workitems/edit/`;

// // Types and other code...
// type Field = {
//   "System.Title": string
// }
// type WorkItemDetail = {
//   id: number
//   rev: number
//   fields: Field
// }

// type WorkItem = {
//   id: number
//   url: string
// }

// type ADOWorkItemResponse = {
//   queryType: string // 'flat',
//   queryResultType: string // 'workItem',
//   asOf: string // '2023-07-27T18:46:46.64Z',
//   columns: { referenceName: string, name: string, url: string }[]
//   workItems: WorkItem[]
// }

// function generateQuery(tags: string) {
//   const tagList = tags.split(',');
//   const conditions = tagList.map((tag) => `[Tags] CONTAINS '${tag.trim()}'`).join(' OR ');
//   const query = `SELECT [State], [Title] FROM WorkItems WHERE ${conditions}`;
//   // `SELECT [State], [Title] FROM WorkItems WHERE [Tags] CONTAINS '${tags}'`
//   return query;
// }

// async function fetchWorkItemDetails(workItems: { url: any; }[], requestOptions: RequestInit | undefined) {
//   const requests = workItems.map(({ url }) => fetch(url, { ...requestOptions, method: 'GET', body: undefined }));
//   const responses = await Promise.all(requests);
//   const workItemDetails = await Promise.all(responses.map((response) => response.json()));
//   return workItemDetails.map(({ id, fields }) => ({
//     id,
//     title: fields['System.Title'],
//     url: `${ADO_STORY_URL}${id}`,
//   }));
// }

// export async function POST({ request }: { request: { tags: string } }) {
//   try {
//     const { tags = 'Rel 07.26.23' } = request;
//     const query = generateQuery(tags);

//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", `Basic ${btoa(`:${PAT_TOKEN}`)}`);
//     myHeaders.append("Content-Type", "application/json");
//     const rawBody = JSON.stringify({ query });

//     const requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: rawBody,
//     };

//     const response = await fetch(ADO_WORK_ITEM_URL, requestOptions);
//     if (response.ok) {
//       const { workItems = [] }: ADOWorkItemResponse = await response.json() || [];

//       const userStories = await fetchWorkItemDetails(workItems, requestOptions);

//       async function* generateUserStories() {
//         for (const userStory of userStories) {
//           yield userStory;
//         }
//       }

//       return json(generateUserStories());
//     }

//     return { status: 500, body: { message: 'Failed to fetch user stories' } };
//   } catch (error: any) {
//     return { status: 500, body: { message: `Something went wrong. Please see error for more details: ${error?.message}` } };
//   }
// }
// *************************************************************************************************************************

import { json } from '@sveltejs/kit';
import { PUBLIC_ORG_NAME, PUBLIC_PROJECT_NAME } from '$env/static/public';
import { PAT_TOKEN } from '$env/static/private';

const ADO_WORK_ITEM_URL = `https://dev.azure.com/${PUBLIC_ORG_NAME}/${PUBLIC_PROJECT_NAME}/_apis/wit/wiql?api-version=6`;
const ADO_STORY_URL = `https://projects-mfrm.visualstudio.com/${PUBLIC_PROJECT_NAME}/_workitems/edit/`;

// Types and other code...
type Field = {
  "System.Title": string
  "System.WorkItemType": string
}
type WorkItemDetail = {
  id: number
  rev: number
  fields: Field
}

type WorkItem = {
  id: number
  url: string
}

type ADOWorkItemResponse = {
  queryType: string // 'flat',
  queryResultType: string // 'workItem',
  asOf: string // '2023-07-27T18:46:46.64Z',
  columns: { referenceName: string, name: string, url: string }[]
  workItems: WorkItem[]
}

type RequestData = { tags: string, selectedProject: string }

function generateQuery({ tags = 'Rel 07.26.23', selectedProject = 'Mattress Matcher' }: RequestData) {
  const tagList = tags.split(',');
  const tagTemplate = (tag: string) =>  `[Tags] CONTAINS '${tag.trim()}'`
  const conditions = tagList.map((tag) => tagTemplate(tag)).join(' OR ');
  const query = `SELECT [State], [Title] FROM WorkItems WHERE ${conditions} AND ${tagTemplate(selectedProject)}`;
  // `SELECT [State], [Title] FROM WorkItems WHERE [Tags] CONTAINS '${tags}'`
  return query;
}

async function fetchWorkItemDetails(workItems: { url: any; }[], requestOptions: RequestInit | undefined) {
  const requests = workItems.map(({ url }) => fetch(url, { ...requestOptions, method: 'GET', body: undefined }));
  const responses = await Promise.all(requests);
  const workItemDetails = await Promise.all(responses.map((response) => response.json()));
  return workItemDetails.map(({ id, fields }) => ({
    id,
    title: fields['System.Title'],
    url: `${ADO_STORY_URL}${id}`,
    type: fields['System.WorkItemType']
  }));
}

export async function POST({ request }: { request: any | RequestData }) {
  try {
    const data = await request.json();
    const query = generateQuery(data);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${btoa(`:${PAT_TOKEN}`)}`);
    myHeaders.append("Content-Type", "application/json");
    const rawBody = JSON.stringify({ query });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: rawBody,
    };

    const response = await fetch(ADO_WORK_ITEM_URL, requestOptions);
    if (response.ok) {
      const { workItems = [] }: ADOWorkItemResponse = await response.json() || [];

      const userStories = await fetchWorkItemDetails(workItems, requestOptions);

      // Return the iterable response directly
      return new Response(JSON.stringify(userStories), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
        },
      });
    }

    return { status: 500, body: { message: 'Failed to fetch user stories' } };
  } catch (error: any) {
    return { status: 500, body: { message: `Something went wrong. Please see error for more details: ${error?.message}` } };
  }
}

