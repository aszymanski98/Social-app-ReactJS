import axios from 'axios';

const deletePost = (id, posts, setPosts, axiosConfig) => {
	let indexToRemove = -1;

	const find = (element, index) => {
		if (element.id === Number(id)) {
			indexToRemove = index;
		}
	};

	axios
		.post(
			'https://akademia108.pl/api/social-app/post/delete',
			{
				post_id: `${id}`,
			},
			axiosConfig
		)
		.then((req) => {
			posts.forEach(find);
			let array = Array.from(posts);
			array.splice(indexToRemove, 1);
			setPosts(array);
		})
		.catch((error) => {
			console.error(error);
		});
};

export default deletePost;
