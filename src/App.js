import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { API_URL } from './api';

function App() {
  const [url, setUrl] = useState(JSON.parse(localStorage.getItem('shortLink')) || []);
  const [copiedLinks, setCopiedLink] = useState(null);

  useEffect(() => {
    localStorage.setItem('shortLink', JSON.stringify(url))
  }, [url])

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const createShortLink = async (data) => {
    const res = await fetch(`${API_URL}${data.Url}`)
      .then((res) => res.json())
      .then((link) => link.result);

      const addLink = {
        id: res.code,
        originLink: res.original_link,
        shortLink: res.short_link2,
      }

    let newArr = [...url, addLink]
    setUrl(newArr);
    reset();
  };

  const copyClipBoard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(link)
    })
  }

  const deteleShortLink = (id) => {
    let filterLinks = [...url].filter((url) => url.id !== id)
    setUrl(filterLinks)
    console.log('Ссылка удалена');
  }

  return (
    <>
      <div className="header">
        <h1>Укороти свою ссылку</h1>
        <form className="short-link-form" onSubmit={handleSubmit(createShortLink)}>
          <input
            type="text"
            className="base-input"
            placeholder="Вставьте ссылку..."
            {...register('Url', {
              required: 'Вставьте ссылку',
              pattern: {
                value:
                  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
                message: 'Введите корректную ссылку',
              },
            })}
          />

          <button type="submit" className="btn-short">
            ЖМИ
          </button>
        </form>

        {errors.Url && <div className="errors">{errors.Url.message}</div>}
      </div>
      <div className="main">
        <ul className="task-list">
          {url.map((item) => (
            
            <li className="task" key={item.id}>
              <div className="content" data-active={copiedLinks === item.shortLink}>
                <p>{item.originLink.substr(0, 30)}...</p>
                
                <a className="text" href={`http://${item.shortLink}`} target="_blank" rel="noreferrer">
                  {item.shortLink}
                </a>
                <div className="actions">
                  <button onClick={() => copyClipBoard(item.shortLink)} className="copy">{copiedLinks === item.shortLink ? 'copied' : 'copy'}</button>
                  <button onClick={() => deteleShortLink(item.id)} className="delete">delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
