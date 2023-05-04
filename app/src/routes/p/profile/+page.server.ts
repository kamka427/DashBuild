import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/prisma';
import fs from 'fs'

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();

	return {
		user: await prisma.user.findUnique({
			where: {
				email: session?.user?.email as string
			}
		})
	};
};

export const actions: Actions = {
    updateProfile: async (event) => {
        const { name, email, team, image } = Object.fromEntries(await event.request.formData()) as unknown as {
            email: string;
            name: string;
            team: string;
            image: string;
        };

        const session = await event.locals.getSession();

        //save image with custom name based on email
        fs.writeFile(`./static/images/${session?.user?.email}.png`, image, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });





        await prisma.user.update({
            where: {
                email: session?.user?.email as string
            },
            data: {
                name: name,
                email: email,
                team: team,
                image: `./static/images/${session?.user?.email}.png`
            }
        });

        return {
            status: 200,
            body: {
                message: 'Profile updated successfully'
            }
        };
    }
};