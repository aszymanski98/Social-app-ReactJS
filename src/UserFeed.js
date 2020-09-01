import React, { useState, useEffect } from 'react';

import axios from 'axios';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import NewPost from './NewPost';
import Recommendations from './Recommendations';
import NextPosts from './NextPosts';

import S from './styles/Feeds';

const UserFeed = (props) => {

    JavascriptTimeAgo.addLocale(en);

    const user = JSON.parse(localStorage.user);
    let jwtToken = user.jwt_token;

    const [posts, setPosts] = useState([]);

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    };

    const getPosts = () => {
        axios.post('https://akademia108.pl/api/social-app/post/latest', {},
            axiosConfig)
            .then((req) => {
                setPosts(req.data);
            }

            ).catch((error) => {
                console.error(error);
            })
    }

    useEffect(() => {
        getPosts();
    }, [])

    const following = (event, option) => {
        let leader_id = event.target.className;
        leader_id = leader_id.replace(/[^0-9]/g, '');

        let href = '';

        switch (option) {
            case 'follow':
                href = 'https://akademia108.pl/api/social-app/follows/follow';
                break;

            case 'unfollow':
                href = 'https://akademia108.pl/api/social-app/follows/disfollow';
                break;

            default:
                break;
        }

        axios.post(href, {
            "leader_id": { leader_id }
        },
            axiosConfig)
            .then((req) => {
                getPosts();
            }

            ).catch((error) => {
                console.error(error);
            })
    }

    const postList = posts.map(key => {
        const date = new Date(key.created_at);
        return (
            <S.Holder key={key.id}>
                <S.UserHolder>
                    <S.Avatar src={key.user.avatar_url} alt="avatar"></S.Avatar>

                    {user.username === key.user.username
                        ? <S.Username>You</S.Username>
                        : <S.Username>{key.user.username}</S.Username>
                    }

                    {user.username === key.user.username
                        ? null
                        : <S.FollowButton className={key.user.id} onClick={(event) => { following(event, 'unfollow') }}>Unfollow</S.FollowButton>
                    }

                    <S.Time date={date.getTime()} />
                </S.UserHolder>
                <S.Content>{key.content}</S.Content>
            </S.Holder>)
    })

    return (
        <S.Wraper>
            <S.Feed>
                <NewPost />
                {postList}
            </S.Feed>

            <S.SideBar>
                <Recommendations follow={following} axiosConfig={axiosConfig} />
            </S.SideBar>

            <NextPosts posts={posts} setPosts={setPosts} axiosConfig={axiosConfig}/>

        </S.Wraper>
    )
}

export default UserFeed;