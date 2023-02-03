import Head from 'next/head';
import { Rowdies } from '@next/font/google';
import styles from '../styles/Home.module.css';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import type { Chats, Posts, User } from './index.d';

const rowdies = Rowdies({ weight: '400' });

export default function Dash({
  userData,
  setUserData
}: {
  userData: User;
  setUserData: Dispatch<SetStateAction<User | undefined>>;
}) {
  const router = useRouter();

  const postTextRef = useRef<HTMLTextAreaElement | null>(
    null
  );
  const chatTextRef = useRef<HTMLTextAreaElement | null>(
    null
  );
  const [posts, setPosts] = useState<Posts[]>([]);
  const [chats, setChats] = useState<Chats[]>([]);
  const [chatUsername, setChatUsername] = useState('');

  const reloadChatData = () => {
    axios
      .get(
        `http://localhost:4000/chat?user1=${userData.username}&user2=${chatUsername}`
      )
      .then((res) => {
        console.log(res.data);
        !res.data.error && setChats(res.data.data);
      })
      .catch(console.error);
  };

  const sendChat = () => {
    axios
      .post('http://localhost:4000/chat', {
        s_username_fk: userData.username,
        r_username_fk: chatUsername,
        contents: chatTextRef.current?.value
      })
      .then((res) => {
        !res.data.error && setChats(res.data.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    chatUsername != '' && reloadChatData();
  }, [chatUsername]);

  const makePost = () => {
    axios
      .post('http://localhost:4000/post', {
        username_fk: userData.username,
        contents: postTextRef.current?.value
      })
      .then((res) => {
        !res.data.error && setPosts(res.data.data);
      })
      .catch(console.error);
  };

  const likePost = (postid: number, username: string) => {
    axios
      .post(
        `http://localhost:4000/like?post_id_fk=${postid}&username_fk=${username}`
      )
      .then((res) => {
        !res.data.error && setPosts(res.data.data);
      })
      .catch(console.error);
  };

  const unlikePost = (postid: number, username: string) => {
    axios
      .delete(
        `http://localhost:4000/like?post_id_fk=${postid}&username_fk=${username}`
      )
      .then((res) => {
        !res.data.error && setPosts(res.data.data);
      })
      .catch(console.error);
  };

  const handleLikeButton = (
    postid: number,
    username: string
  ) => {
    axios
      .get(
        `http://localhost:4000/existslike?post_id_fk=${postid}&username_fk=${username}`
      )
      .then((res) => {
        return res.data.data;
      })
      .then((exists) => {
        if (exists) unlikePost(postid, username);
        else likePost(postid, username);
      })
      .catch(console.error);
  };
  const deletePost = (postid: number) => {
    axios
      .delete(
        `http://localhost:4000/post?post_id=${postid}`
      )
      .then((res) => {
        !res.data.error && setPosts(res.data.data);
      })
      .catch(console.error);
  };

  const reloadPostData = () => {
    axios
      .get('http://localhost:4000/post')
      .then((res) => {
        console.log(res.data);
        !res.data.error && setPosts(res.data.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (
      !userData ||
      !userData.username ||
      !userData.password
    ) {
      router.push('/');
    } else {
      reloadPostData();
    }
  }, []);

  return (
    <main
      className={styles.main}
      style={{
        position: 'relative',
        height: 'auto',
        marginBlock: '5vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {userData && (
        <div
          style={{
            position: 'relative',
            width: '95vw',
            minHeight: '95vh',
            paddingBlock: '5vh',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px'
          }}>
          <div
            style={{
              fontSize: '3.5rem',
              color: 'white',
              marginBottom: '25px',
              textAlign: 'center'
            }}
            className={rowdies.className}>
            Welcome to{' '}
            <span className={styles.social}>Social</span>
            !
            <br /> {userData.username}
          </div>

          <div
            style={{
              width: '100%',
              display: 'flex'
            }}>
            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center'
              }}>
              <div
                style={{
                  display: 'flex',
                  gap: '20px'
                }}>
                <button
                  className={styles.bttn}
                  onClick={(e) => {
                    e.preventDefault();
                    makePost();
                  }}>
                  Create
                </button>
                <button
                  className={styles.bttn}
                  onClick={(e) => {
                    e.preventDefault();
                    reloadPostData();
                  }}>
                  Refresh
                </button>
              </div>
              <textarea
                ref={postTextRef}
                style={{
                  width: '80%',
                  borderRadius: '15px',
                  border: '1px solid black',
                  outline: 'none',
                  minHeight: '4rem',
                  paddingInline: '1rem',
                  paddingBlock: '1rem',
                  fontSize: '1.2rem',
                  resize: 'vertical'
                }}
              />
              {posts &&
                posts.map((post, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        background: '#FAF9F6',
                        borderRadius: '20px',
                        width: '80%',
                        paddingInline: '1.5rem',
                        paddingBlock: '1rem'
                      }}>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          color: '#e0115f'
                        }}>
                        {post.username_fk !=
                        userData.username ? (
                          <span
                            style={{
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              setChatUsername(
                                post.username_fk
                              );
                            }}>
                            {post.username_fk}
                          </span>
                        ) : (
                          post.username_fk
                        )}
                        {post.username_fk ==
                          userData.username && (
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              outline: 'none',
                              font: 'inherit',
                              marginLeft: '1rem',
                              cursor: 'pointer'
                            }}
                            onClick={() =>
                              deletePost(post.post_id)
                            }>
                            ❌
                          </button>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          marginBottom: '10px'
                        }}>
                        {new Date(
                          post.created_at
                        ).toLocaleString()}
                      </div>
                      <div>{post.contents}</div>
                      <button
                        onClick={() =>
                          handleLikeButton(
                            post.post_id,
                            userData.username
                          )
                        }
                        style={{
                          border: 'none',
                          background: 'none',
                          color: 'red',
                          fontSize: '1.2rem',
                          cursor: 'pointer'
                        }}
                        className={styles.heart}>
                        &#10084;
                      </button>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          marginLeft: '0.25rem'
                        }}>
                        {post.count ?? 0}
                      </span>
                    </div>
                  );
                })}
            </div>
            {chatUsername != '' && (
              <div
                style={{
                  position: 'relative',
                  width: '50%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  alignItems: 'center'
                }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '20px'
                  }}>
                  <button
                    className={styles.bttn}
                    onClick={(e) => {
                      e.preventDefault();
                      sendChat();
                    }}>
                    Send
                  </button>
                  <button
                    className={styles.bttn}
                    onClick={(e) => {
                      e.preventDefault();
                      reloadChatData();
                    }}>
                    Refresh
                  </button>
                </div>

                <textarea
                  ref={chatTextRef}
                  style={{
                    width: '80%',
                    borderRadius: '15px',
                    border: '1px solid black',
                    outline: 'none',
                    minHeight: '4rem',
                    paddingInline: '1rem',
                    paddingBlock: '1rem',
                    fontSize: '1.2rem',
                    resize: 'vertical'
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    gap: '20px',
                    width: '80%',
                    flexDirection: 'column'
                  }}>
                  {chats.map((chat, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          background: '#FAF9F6',
                          borderRadius: '20px',
                          paddingInline: '1.5rem',
                          paddingBlock: '1rem',
                          width: '60%',
                          marginLeft:
                            chat.s_username_fk ==
                            userData.username
                              ? '40%'
                              : '0'
                        }}>
                        <div
                          style={{
                            fontSize: '1.2rem',
                            color: '#e0115f'
                          }}>
                          {chat.s_username_fk}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            marginBottom: '10px'
                          }}>
                          {new Date(
                            chat.created_at
                          ).toLocaleString()}
                        </div>
                        <div>{chat.contents}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
