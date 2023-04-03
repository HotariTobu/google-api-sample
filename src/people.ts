export default async function () {
    const response = await gapi.client.people.people.get({
        resourceName: 'people/me',
        personFields: "names",
    })

    console.log(response.result);
}