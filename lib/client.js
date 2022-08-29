import sanityClient from '@sanity/client';
import imageUrlBUilder from '@sanity/image-url';

export const client = sanityClient({
    projectId: 'w4fjzwe2',
    dataset: 'production',
    apiVersion: '2022-08-17',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

const builder = imageUrlBUilder(client);

export const urlFor = (source) => builder.image (source)