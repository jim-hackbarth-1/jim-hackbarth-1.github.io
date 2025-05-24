
import { Map } from "../references.js";

export function getTemplate() {

    const caption = {
        "defaultText": "",
        "opacity": 1,
        "font": "16px Papyrus, sans-serif",
        "fontColor": "#303030",
        "fontVariantCaps": "small-caps",
        "fontOutlineColor": "#303030",
        "backgroundFill": {
            "options": [
                {
                    "key": "PathStyleType",
                    "value": "ColorFill"
                },
                {
                    "key": "Color",
                    "value": "#e0ffff"
                }
            ]
        },
        "borderStroke": {
            "options": [
                {
                    "key": "PathStyleType",
                    "value": "ColorStroke"
                },
                {
                    "key": "Color",
                    "value": "#303030"
                },
                {
                    "key": "Width",
                    "value": 1
                }
            ]
        },
        "shadow": {
            "blur": 15,
            "color": "#000000",
            "offsetX": -10,
            "offsetY": 10
        }
    };

    const textureImage = "data:image/png;base64,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";
    const texture = {
        "ref": {
            "versionId": 1,
            "name": "Texture"
        },
        "thumbnailSrc": textureImage,
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "TileFill"
                    },
                    {
                        "key": "Opacity",
                        "value": 0.5
                    },
                    {
                        "key": "TileImageSource",
                        "value": textureImage
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    },
                    {
                        "key": "Color",
                        "value": "#696969"
                    }
                ]
            }
        ]
    }

    const landBackground = {
        "ref": {
            "versionId": 1,
            "name": "Land background"
        },
        "thumbnailSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAIhJREFUSEvtlksKgDAMRNObKehh4t5TuHcuU9CbKRYUP1REo3Ux3XeGTPJgnCR6LpGv0FhUtRORzHgFPYB8rXmIWlUHY9MgB2DjFTVu68LEv2o8jUMCjHrCKVw1j+suW8RpTo44Eae7FC3/iNN/cXq83J3AlerzRtnzAMrTsmc9aUyPhf6rpGUEeEqQH4XOw1EAAAAASUVORK5CYII=",
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorFill"
                    },
                    {
                        "key": "Color",
                        "value": "#ffdead"
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    },
                    {
                        "key": "Color",
                        "value": "#696969"
                    }
                ]
            }
        ]
    };

    const waterBackground = {
        "ref": {
            "versionId": 1,
            "name": "Water background"
        },
        "thumbnailSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAIlJREFUSEtjZBggwDhA9jKMWsyQmZm5n4GBwYHKUXBg+vTpjshmYgR1ZmbmfypbCjZu+vTpKHbhtHir+jSq2O99M2vUYnAIjAY1KDuBU/Vo4iI3b41mJ1jIjWan0exEbi6C6xvNToM3O1EcuWgGENP0oUVjb8/06dNd8Tb2qO1TXOaNNujpFdIMACmJkB/wBvmqAAAAAElFTkSuQmCC",
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorFill"
                    },
                    {
                        "key": "Color",
                        "value": "#1e90ff"
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    },
                    {
                        "key": "Color",
                        "value": "#696969"
                    }
                ]
            }
        ]
    };

    const land = {
        "ref": {
            "versionId": 1,
            "name": "Land"
        },
        "thumbnailSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAABDFJREFUSEvtlmtsFFUUx/9nu1hWaql9gIuNW2mrhbqtadAG6osIFCppQiOoia/GWme2KSE+EmNMlAgaRaOwde7sSigRIUE+kGiDokVogCqiJC2PFQVaWrGtxUVbSy0wc9072d3stvtwSxq+eJLJ3Llzzv3dx3lcwjUSukZcBMEOh6ORc74YwCdEtEdRlC8nclIGWJbltQBeCQVxzt/Rdf1Vt9t9eSImEABvBPDMsvvzYbspFdubf0LPH0OCt1/X9XqXy9UWDS5JUjmAuURUAuBrIvpCUZRT8SYbAIttLZeWFaMoL8uweWPTtwF4B4BqxlhL6GB1dXU2sSMAakZDdF1f4HK59sSCB8CrALxfMe9WLC3LDeqrO9vQfqofnHMvEVUT0QnO+RIAgcfQfXj+bcbbc9aL42fOw2Sibk3TK1RVPRYNboAlSbqZiH4V7dXPliErzRLU37rbg4Pt58T3FQDm0IHE7iwtm4nsaTcEuzd+dhRHTvaJbydjbGVMsB++jYgeKy204qmKwjD9xqZjOOzpNfrsuVmYlZOOvOy0MGDA4MLgP1jT+B0fuaRdJJPJ3tDQII5qjATDSZKkMiI0AzS56oF8LLjLFqbc1TcAa0YKJplN8fwGO775GXt/7BJHtFpV1ddjgsVPWZbrAWwQ7frlJcbKxiNnfvsL7249LEwPMMbujQv2b3kjET0tzm3lihKkWCaNh40XNuzD8MgVaJo2w+1294weZEzKlCRpGhF9BaB4nn0GHl88e1zg9duP4GSXV2z3k6qqbokLFgoOh2MR53y3aD+6sAD33ZmdMLzp4Gnsau0Q4PWqqopwDZOoRcLhcLzIOV+XnjoZa567J2HwD55ebGoywvhzxljlfwb7nW2XSBY1lXaU3D49IXh33yDe+viQsDnOGLsjJliSJOH6VUR0iy+TTQ0oy1XFRvwmIpcua1j1wV5hMswYuz4quLa2NjcpKSmY3C3JZmRMtaAoLzMsjSYCf6mhBUPDRnFLZ4xdCLUNTSA5RNSRlpKMN+WIoZcI09Bdu/kQzvUPgohmK4riiQj2e3M759weKXNFo2o6R593CBmpFiRflxSm9vaW73G2d0B49nxVVfdFBcuy/DyA94RCvMzl6fRiZ8sv6Dn/NwRcyINzbJgza7pR04W8rOzHwNAIzGZzntPpPB0V7PdkEb+LrBlTUFNZBGvmlDGL7f/zIl77qDW0v9PvjDeKzgJbOjLTLDjQZlS1TrPZXOB0Okdigv1wYwnR4I51zYExPtQ0zeV2u4/6j+oRzvkTAB4KKHDOq1VV3RzVq0f/8GWvVl/2mivgdxdaUV6aY9RZUW+FxKo8siwv4ZyXmkym3xVFUSL5R8zrrSzLn/oSwPIIhjsYYysSdvMQg7j3almWawGIJ993IewGcOJqoYIfF3w1q4pl+z94onZ2zLj/Asn+gy6IFxn2AAAAAElFTkSuQmCC",
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorFill"
                    },
                    {
                        "key": "Color",
                        "value": "#ffdead"
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#696969"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    }
                ]
            }
        ],
        "caption": caption
    };

    const grass = {
        "ref": {
            "versionId": 1,
            "name": "Grass"
        },
        "thumbnailSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAABCBJREFUSEvtll9oW1Ucx7+/5GZp167LQluGZbXQDlyxCLLhhitM6DqrUJhjLTKUZrpyT8pExCfxQR98UUQ09Z6bIEyo9EEfO1qtlil19qFjzDrnWB3taJlY29T+cW2X5h77uyQhaXuTNjL24g9Czj33d87nd37n9+cSHpLQQ+IiBQ4GgxeUUs8C+IKIBgzD+PpBGmWDhRDvAXgrHaSUet+yrLcjkUjsQRiQBH8G4JWh4iFMeaZQv1AP/6qfeYOWZZ0Ph8M/O8F1XT8B4AgRPQngWyLqMwzj91zGJsHs1hN9vj6Me8ftNa0zrUn4GICAlPKH9M06OjoeZY8AeHU9xLKshnA4PJANngS/DuCj4aJhXCm+ktJv+rsJVStVUEpFiShARDeUUk0Akj9b9/Kuy/b/vvv7ULlSCUVqAhaeM03zuhPcBuu6XkFEkzzuLu3GnHsupX9s/hgOLB3g51UAWvpG7J3h4mFMa9Op6ca5RlQvV/NzSEr5WlZwAt5NRC/eKryFgZJMLzXMNWD/8n57jzveO5jYMYG7nruY8cxs2Lc4XoyWmRblUZ57HrenrrOzk69qg6TSSdf1pwF8R0QFQ7uGcG3ntQzlslgZZrVZrBIfPLscXTiKunt1fEXvmqb5TlYwvxRCnAfwCY8v7rlonywf2Rvbi5PRk7z0RyllfU5wwuUXiKiN3djj68GSaykfNs5OnYVXeRGPxx+JRCJ/rN9kQ8nUdb2ciPoBPHGz8CYulVzKC9w824yK+xXs7pdN0+zKCWaFYDDYqJT6hseDJYO4XuiYFY5GHVw8iEP/HGLwx6ZpcrpmiGOTCAaDbyqlPlh0L6KrdIPBOb1Qs1yD43PHWa9HStm8ZXAi2Hq5WPTv7sftgts5YekKpbFSnI6e5qlfpZSPZwXrus6h/wIRVa5Vst1J5V5fr52/2xFNaTg3dY6XLEkpdzqC29vbq91ud6q4r9AKFtwLGPOOZZTR7cADfwVQYBXwEr+UcjZ9bXoBqSKisUXXIrrKtn+nmxnUGm2FP+YHEdUahvHbpuBENI8opeo2q1xOJ3UpF3xxH+Zd81h1ZVa1U9FTKI+Vc2Q/Y5rm945gIcQbAD5khVyVizvR4YXD8Mf9YDjLSNEIRr2jdk9naZtuQ2G8EJqm1YRCoYzo3JBOQgjO38aoFgVHM9fn9VKyWoIzM2fSp7mJczDu4cnJHZOYd8+jdqmWH8c1TXssFAqtOJ44+UIIoXjsBBd/iqTqp/F4PByJRH5JXFWrUuolAM8nFZRSAdM0P8+aTukv16rXT2vV6wjDRwtGcbXoqt1nud+yZOs8QogmpdRTLpdryjAMY7P4yPp5K4T4cq0A2FVgnXwlpWxxCritzOf8rhZCtAPgH38JcJ+88V+hbFhO8Fasz0fnf3A+Xstrzb+EbpUu9yQLdQAAAABJRU5ErkJggg==",
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorFill"
                    },
                    {
                        "key": "Color",
                        "value": "#9acd32"
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#696969"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    }
                ]
            }
        ],
        "caption": caption
    };

    const snow = {
        "ref": {
            "versionId": 1,
            "name": "Snow"
        },
        "thumbnailSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAABA1JREFUSEvtlm1ILFUYx//PumKGkPkSWJJBBhppIKJcIyGUa9ckUKwM7JokMjOiSCZIBCa+YRlha3NmF3GDMjA/+CGx14s30r4oQpZXhPJeNRETEgQTrdnTPsPusr7s7lWR+6UHhjlz5nnO78xznvM/Q7hHRveIiwBY0zS3lPJ5AJ8R0Q1d17++zElZYFVVuwG8HQySUr7n8Xjecblc/1zGBPzgIQBvlJeXIy0tDaOjo9jc3GTejx6Pp9HpdP4cCq4oSgmAK0SUA+A7IvpK1/XfIk3WD+a0liiKguzsbCums7PTD78NoFYI8UPwYA0NDWmcEQB1xyEej6fY6XTeCAf3g5sBfFhaWoqysrKAv2EYWFhYgJTyLyKqJaJbUsprAPyX5VtZWWndl5aWsLi4CJvNtm6aZqlhGL+GgltgRVEeIaI/uN3R0YHk5OSA/8jICGZmZvj5XwD24IE4OzzR1NTUQPfQ0BDm5+f52SGEaAoL9sE/J6JX8/PzUVNTc8Tf7XZjdnbW6svKykJmZibS09OPAP0BOzs76OrqkgcHB38TUdbg4CAv1QkLbCdFUZ4hou8B3FdRUYHi4uIjzmtra0hJSUF0dHSkusHY2BimpqZ4iTq8y/VuWDC/VFW1EcBH3G5sbLS+7Dy2srKC/v5+Dp0WQjwbEexLuZuIXud1a2pqQlxc3HnYaGlpwf7+PkzTfNjlcll7M9hOSKaiKA8R0bcAni4oKEB1dfW5wAMDA1heXuZ0XzcM49OIYHbQNO2qlPIbbldVVaGwsPDM8ImJCUxOTjJ4wDAM3q7hv9j/VtO0t6SU7yckJHCVnhk8NzeH4eFhjvtSCPHiXYN9xTbJYlFXV4ecHFbEu7f19XX09vZywKIQ4qmwYK9kculXENGjXiV7wO+sqqq1f89ih4eHaG62MrwvhLg/JLi+vv7xqKiogLjHxsYiMTHR0u5gGT0LvLW1FXt7exySIITYObWqFUV5jIhux8fHo6en5yzjh/Tt7u7GxsYGiOhJXdeXQm4nTdMWpJRZpylXqNFN08TW1paVnZiYmCNufX19WF1d5cp+zjCMmyHBqqq+CeADdoikXHwSjY+PW0cnw9mKioqQm5trnelsbW1t2N3dhd1uT3c4HL+HBPsqmffvVdZlrma+H7ft7W20t7cHd9/xFeOD3JmRkYGkpCRMT0/z4x273Z7hcDgOwoJ9cMn3UHBN0/xjfGyaptPlcv3CHZqmvSKlfA3AC34HKWWtYRifhKzq4y+86vWTV72uMDwvLw8lJSXWOcvnLVu4k0dV1WtSynybzfanruv6afUR9vdWVdUvvALw0imBY0KIly9S+hH/q1VVrQfA1xPeH8J1ALcuCuUJRwRf5KvCxf4PvqzMnhj3P1zogy6U86vLAAAAAElFTkSuQmCC",
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorFill"
                    },
                    {
                        "key": "Color",
                        "value": "#ffffff"
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#696969"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    }
                ]
            }
        ],
        "caption": caption
    };

    const pavement = {
        "ref": {
            "versionId": 1,
            "name": "Pavement"
        },
        "thumbnailSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAIhJREFUSEvtlt0JgDAMhNPN9MEZOkMmuhm6g6CbKRYUf6hIjbYP1/fekUs+OCeFnivkKzQWVR1EpDFewQig3WteolbVydg0ygE4eCWNvfcm/iEEGscEGPWCU7xqHlcuW8RpTY44EadcirZ/xKlenF4v9yTwpPp8UfZ6AN1t2bOeNKXHQv9X0jIDAZuQH2R4UtQAAAAASUVORK5CYII=",
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorFill"
                    },
                    {
                        "key": "Color",
                        "value": "#c0c0c0"
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#696969"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    }
                ]
            }
        ],
        "caption": caption
    };

    const water = {
        "ref": {
            "versionId": 1,
            "name": "Water"
        },
        "thumbnailSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAABClJREFUSEvtlmlsVFUUx/9nlm62Tpl2gC4CYTFFaQ2EiEDahAgtW0wkrolbI2nee02JcUmMMVEiaNxicOq7bybEmrgkwgc+aHCtYkQThRBBoYEWpqW0pS1YbOlK37v2vMyM3WaG0jR88SQv7y7nnt995517ziXcJKGbxEUUrGlajZRyI4BPiKhW1/WvZ3JTNlhV1d0AXhoNklK+ZVnWy8Fg8NpMbCAC3gvg6Trf/biSMh/L2j9HxlAb8362LKsqEAgcjwVXFKUMwGoiWgHgOyL6Stf1hkSbjYDZrWVH8xS0pxfZa0pCr0XgIQDlQoifRhurrKyczx4BsH08xLKs9YFAoDYePAJ+BsB7Z7I2oz57a1R/ZYuBOVdPQEr5NxGVE9EpKeUmAJHH1j01+wH77eutg6/3JCQ5mmGZmw3D+CsW3AYripJHRBe4fWjhTvS6fVH9oouf4rZ/fuH+MADXaEPsnTPZW9GdnB8dXtG6Fzk9x7jvF0LsiAsOwz8jokdbPKvwx9wnx+gvb6tBbvcRe6wjvRCdaUtxOXUxelL+A0YWpA53oTi0SzqtwT63kwqrq6v5V02Q6HFSFGUtQN8TIaXOtw3nvOvHKHsGzuNqcg5McieKG9zZsR8Lun7kX7TTMIxX44J5UlXVKgDvc/v3/Cp03rI0IWQyhVn957Dm/Ds8dVgIUZwQHHZ5DRE9xW78LX8HBp3pNwQvrX8ObqsfpmnmBoNB+2yOlgkpU1GU2UT0LYC7LnjW4Pjcx24IfE/zHmT1nWZ3P2EYxscJwaygaVqplPIbbp+c8wgaM0umDF9y6Uvcfvkgg/cYhsHHNf4XR2Y1TXteSvn2gNuL2oW7pgzO7T6K5W0f8rovhBD3XTc4HGwHOVkcy92OtgzOiNcvtw40o7jpDdtpQohlccGKonDobyOieSOZzBNRPpKn2ud3KuK0hrCx3vZwvxAiLSa4oqJikdPpjCb3a45U9LuzcDG9aEwanQp8Q8MLSDJ7eYlXCNE1aVQrirKAiEL9rkz8sOj1qdiPqVvSuBsZgy0gojt0Xa+LeZw0TTshpSycLHPFsk7SRPpQO/rcWTAdyWPU1ja9icyBJo7sdYZhHIoJVlX1WQDvskKizMWVqKDzgF06Gc4S8t6L1oyVdk1n2XD2RSQNd8Plci32+/1nY4LDkcznt7QnKQcczZyfx0vaUCfWhV4ZPdwYDsZZPHgprQB9SdmYd+UwdxtdLleB3+8fjAsOwyW/Y8G3nNYiNj4wTTMQDAb/5AFN0x6WUj4OYEtEQUpZbhjGRzGjevzESPb6dSR7rWZ4q+duNHjL7DrL9ZYlXuVRVXWTlHKVw+Ho0HVdnyw+4l5vVVXdN5IAHpxk4X4hxEPTCf2E92pVVSsA8LNk5ELYzDed6UJ5wwnB0/mqeGv/B8+UZyfY/Rc8U4wuUn3WvgAAAABJRU5ErkJggg==",
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorFill"
                    },
                    {
                        "key": "Color",
                        "value": "#1e90ff"
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#8cf3f3"
                    },
                    {
                        "key": "Width",
                        "value": 10
                    }
                ]
            },
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#696969"
                    },
                    {
                        "key": "Width",
                        "value": 13
                    }
                ]
            }
        ],
        "defaultZGroup": 1,
        "caption": caption
    };

    const contour = {
        "ref": {
            "versionId": 1,
            "name": "Contour"
        },
        "thumbnailSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAsxJREFUSEvtlD1oFEEUx9/MXg6xs1FMzHzsFYLENBbiBxKwSKEnRDSKBtRAFEwKUZTY2SWoRQgSEUEtrAQRvxEMBPEDP0ihJqQwO28258GBhRZykOzOmJU9Oc2ZI3fRNDfl7pv3e///e/MILNEhS8SFGvi/OV+zeo7VQogWAGhBxHOL2Yd5reacryaEvAOAp4h4KAJzzruttRO+7w9XU8jfwAkACKLEQohI6SZEbGWMuZTSh9F3Smm753kfKoXPATPGthBCemdmZo5ks9kvseoHiLhBCNEPAB2EkN1KqTeMsXW+749XAi+pWAgR2dobBEE6k8l8ilQTQoattZHaXYg4EsecRsSmqsGc8x1a659WSim5tXYkDMO9lNLPWusc57xVa/1YCDEAAJ0A0JfP5wdzudz3hcJ/KWaMraCUjgLAS0ppf6F/UsqrSqmuVCq1Mp/Pm2QyeQsAvlJK+zzPe7tQYCH+N6s55wcJIR0AsNlaO+g4zkXP877F0xxNeLO1NqW1HiokcF13pzEmjYjHFlJEyR7HyY4CQAYRj5dKWBSzjRByKQiCoampqWwU67ru+jAMH1FKzyqlbpa6P+87dl2XeZ7nF19saGhYU1dXFylOA8Blx3GGJicnPwohDiPiDSlls1LqvRBiPwCctNbmrLX9vu+/KM5T0a7mnF+glN5XSj2L23CeELLWcZweY8wJY0yotT7T2NiYchznFAAcAICB4u1XEbhQ+ey7XgYA0bCFiNgmpdyjlLojpXwCABNKqZ64sE6t9bWqFUcJouVBKY2g44jYHm+569PT092JREJQSl8BwG1EjJ7dnFOVYsbY9sLOrq+vX55MJseCINiayWQ+c87bCCFXAKALEe/+Sa4KXJxMSpm21t4zxjT5vj8WO7AREV8vuuLihEKIfbNTvsoYM+r7/vNyb3rRFJcD/TOra+ByDtR6XM6hRfv/A5XTJS7mZ43ZAAAAAElFTkSuQmCC",
        "fills": [],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#202020"
                    },
                    {
                        "key": "Width",
                        "value": 10
                    },
                    {
                        "key": "Dash",
                        "value": [1, 2]
                    },
                    {
                        "key": "Cap",
                        "value": "butt"
                    }
                ]
            }
        ],
        "defaultZGroup": 2
    };

    const fence = {
        "ref": {
            "versionId": 1,
            "name": "Fence"
        },
        "thumbnailSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAKxJREFUSEvtltEOgCAIRfXLqy+vaNqKUG8DR2320jLYgQtMYnB6ohM3lMBzCsjq/civBF6TZf6v/X4NJgeC/w7MM132g6N8vaWGwBTJxCxzhNomq9a4Bjafup5zXE3kE2A3qd3A1g00anxT9NrVo8baZoOby01qN7BWWu4PSy2BNdchDJYMczDmu1drjlGwpJa0q512rWsRXfLcwGgp4Iw1zUUQ7g+DrUfMH7wBXsdaH/ycbXIAAAAASUVORK5CYII=",
        "fills": [],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#000000"
                    },
                    {
                        "key": "Width",
                        "value": 6
                    },
                    {
                        "key": "Dash",
                        "value": [6, 40]
                    },
                    {
                        "key": "DashOffset",
                        "value": 3
                    },
                    {
                        "key": "Cap",
                        "value": "butt"
                    }
                ]
            },
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#000000"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    },
                    {
                        "key": "Dash",
                        "value": [2, 2]
                    },
                    {
                        "key": "Cap",
                        "value": "butt"
                    }
                ]
            }
        ],
        "defaultZGroup": 2
    };

    const stoneThumbnail = "data:image/png;base64,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";
    const stoneStructure = {
        "ref": {
            "versionId": 1,
            "name": "Stone structure"
        },
        "thumbnailSrc": stoneThumbnail,
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "TileFill"
                    },
                    {
                        "key": "Opacity",
                        "value": 1
                    },
                    {
                        "key": "PresentationMode",
                        "value": "Normal"
                    },
                    {
                        "key": "TileImageSource",
                        "value": stoneThumbnail
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#202020"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    }
                ]
            },
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#dcdcdc"
                    },
                    {
                        "key": "Width",
                        "value": 10
                    }
                ]
            },
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#202020"
                    },
                    {
                        "key": "Width",
                        "value": 13
                    }
                ]
            }
        ],
        "defaultZGroup": 3,
        "caption": caption
    };

    const structure1Thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAIhJREFUSEvtlt0JgDAMhNMpuo4+OEwmumUEXadTKBYUf6hIjbYP1/fekUs+OCeFnivkKzQWVR1EpDFewQig3WteolbVydg0ygE4eCWNvfcm/iEEGscEGPWCU7xqHlcuW8RpTY44EadcirZ/xKlenF4v9yTwpPp8UfZ6AN1t2bOeNKXHQv9X0jIDNV+QH1hm+fkAAAAASUVORK5CYII=";
    const structure1 = getStructure("Structure 1", structure1Thumbnail, "#808080", caption);

    const structure2Thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAIVJREFUSEvtll0KgDAMg7ub6YOH6Q60XEbQmykOFH+YyKxuD9n7Epr2gzgp9FwhX6GxqOogIo3xCkYA7V7zErWqTsamUQ7AwStp7L038Q8h0DgmwKgXnOJV87hy2SJOa3LEiTjlUrT9I0714vR6uSeBJ9Xni7LXA+huy571pCk9Fvq/kpYZIjqQH/+Uy2YAAAAASUVORK5CYII=";
    const structure2 = getStructure("Structure 2", structure2Thumbnail, "#d3d3d3", caption);

    const structure3Thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAIhJREFUSEvtlksKgDAMRNObpDfRhbcW9CZNTxJpQfFDRWqwLqb7zpBJHoyjRs818iUYEzNPRNQZr2AWkX6veYmamdXYNMuJyMGraBxCMPH33sM4J4CoE075qnFctWwBpzU54AScaina/gGn/+L0erkngSfVx7zsqeoYYxxuy571pCU9FPqvkqYFgEiTH8Xk5rgAAAAASUVORK5CYII=";
    const structure3 = getStructure("Structure 3", structure3Thumbnail, "#ffffff", caption);

    const structure4Thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAItJREFUSEvtlksKgDAMRNObxJ3HUNBbF/QY7kxPErGg+KEiGqyL6b4zZJIH4yjTc5l8CcbEzB0RVcYr6EWk3mqeomZmNTaNciKy80oaj4M38S/KBsYxAUQ94xSvGsf1lC3gtCQHnIDTU4rWf8Dpvzi9Xu5B4E71MS97qupDCO1l2bOeNKWHQv9V0jQBq5mTHzK0/ZgAAAAASUVORK5CYII=";
    const structure4 = getStructure("Structure 4", structure4Thumbnail, "#fff8dc", caption);

    const structure5Thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAItJREFUSEvtlt0JgDAMhNNNMooKzqIj6S6ijpJOErGg+ENFNFgfru+9I5d8cI4SPZfIl2BMzDwQUWa8glFE8q3mKWpmVmPTICciO6+ocd9UJv5F3cI4JICoZ5zCVeO4nrIFnJbkgBNwekrR+g84/Ren18s9CNypPuZlT1U77315WfasJ43podB/lTRNEgyTH36yeZ4AAAAASUVORK5CYII=";
    const structure5 = getStructure("Structure 5", structure5Thumbnail, "#deb887", caption);

    const structure6Thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAI1JREFUSEtjZBggwDhA9jKMWsygoKCwn4GBwYHKUXDgwYMHjshmYgS1goLCfypbCjbuwYMHKHbhtDhb9TNV7J96m3fUYnAIjAY1KDuBU/Vo4iI3b41mJ1jIjWan0exEbi6C6xvNToM3O1EcuWgGENP0oXpj7////3sePnzoirexR22f4jJvtEFPr5BmAADsTpMfnkVSKQAAAABJRU5ErkJggg==";
    const structure6 = getStructure("Structure 6", structure6Thumbnail, "#8b4513", caption);

    const structure7Thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAI1JREFUSEtjZBggwDhA9jKMWsygoKCwn4GBwYHKUXDgwYMHjshmYgS1goLCfypbCjbuwYMHKHbhtPj+tIVUsV8xK37UYnAIjAY1KDuBU/Vo4iI3b41mJ1jIjWan0exEbi6C6xvNToM3O1EcuWgGENP0oXpj7////3sePnzoirexR22f4jJvtEFPr5BmAADUq5MfHoQi/gAAAABJRU5ErkJggg==";
    const structure7 = getStructure("Structure 7", structure7Thumbnail, "#ffb6c1", caption);

    const tree1Thumbnail = "data:image/png;base64,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";
    const tree1 = getTree("Tree 1", tree1Thumbnail, caption);

    const tree2Thumbnail = "data:image/png;base64,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";
    const tree2 = getTree("Tree 2", tree2Thumbnail, caption);

    const tree3Thumbnail = "data:image/png;base64,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";
    const tree3 = getTree("Tree 3", tree3Thumbnail, caption);

    const tree4Thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAyCAYAAADMb4LpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABSTSURBVGhD7VlpjGTnVT1vqffq1b4vvUx39fR09+yemZ59vMUmJjGOlEhYCPiRCCkSCCGk/CBCICcIMMgxcgA5sh0WQQhoYpEogZCxsOMkkhNnYuxZPIun97269n179R7ne1MZ6DiLHST+JF+rVN21vO9+9557zrmv8fP18/UztqTB8//Leuyxx+QjRzzebjfTefTRR7uDl3/q9X8O3rZt6clnPxaVLWva7dVGvR6Pa2V1fU+5Vn2/rmnpeDJa6HZ6m5tbm/t7nW5aVl2y3Ycdj6d66fTw83uHM799992/Vhpc7l2tnzp4kUUjUrzQ7FYfrNaKKJXzKFeLaDabcBs+JJIpcTBsb2fh9XswkZmAqrjQ6/XRt2xsrG2hUqljKD1iHzh4eP7UsTO/dGLv+24OLv+O1k8V/Pnzv6wsFZJvaoY8Xa3lALkHlwY0Ww0UigX0+gqGh8f4d1OUBrIio1goil+hawZUlw5JUiBLLszdWkQ0EsfQ8Kh5/OjZpz5w1vi4JD3aH2z1Y9e7Dv6ZZ55xeZKlG6puTswvXUfXrMO02gzIhqQwOklCtdZFOBxHsVSC2Teh8WStVouBu6GqGqvTgtcIoNuzMD+3BFgSAsEIpnfvRyqWeevYxJ4js7Mf4Ml//JIHz+94dfT5L+heTNxauIKt/CoUl+UE3zGbjMGELfcRiHhRaRRx9fpl3Jq7gXqrBFWXYKKDVrfKQ1poduuoEG4WesgWsiiUcvjeG6/i6998Yer8C18rfOPiV9872PJHrneU+T/8k996wOXqP76aXTwUTwX1XeNp5IsbWFlbQjgWhKarhEoXNkNx6cxyp4ue2cfKyipkWWYVgsy4CpeiQZJV2H2JUCLObBWVch2dTh/NRst53aME0G70cOr4aevecw/+7plDv/hXgzDetn5i8H/w+K+/NjOz+2i+tI2N7Cp0Q0FiKI5KtcDGM9FnwN1el79bhI7Gv5hLVkJxSahVa07QqouH6/a4mQzr+4FbMg9o83Ub9VoT8VgKfdNC0B3C+vImYeUHe8DaO3Ps7rMHH3hlEM6O9UODP3/+vDI0hoP/8dLnLng8eiKZTjp4LrPMiibD8BjIF3KETR71RpOs0eABTDat2wFiZk8SvqDu4Nzk641GA52uCUPn+/btoHWXwQZWYFsK6vU2gv6Q81mf5kVxu4xWo4tjR06xAvcWzh30piTpfnMQ3p2lDJ7vrCeeeOK421AuXnjp8x/bLt30pYfDaJtVtLs11OrELhuzY7axSQpsttqwmMH5hTUGaiEeT8PrDbAyIcSTQYSjYfj8PjZtj1ntk0LZsKyOePQYqEIIaW6D0FLQty1srm+iTcaKREKsbM2pVjQcMyT3+Lee/ovnFgYh3lk7gn/yyccPz57a/92jx/cFFjfelLpWE6FY3MGk4nITEBJabROLy8tOVqf3TmBoKMqMd5FMGchkQpiYDCMUthEJa/BqxHevB4/qxlAihXQ0CZXXKOcKyG/n+BuvK5GhCD/bNlmRLtrtPr8f4z5NJquMYMgtJePh+z771+efGoR5Z+1gm/hw4El/yIVby5fbkWTUTgyPQNY8ADeH4kax0mKWV9HtWgw2zpKTPdp5Bh3EzEwYXl+NWdwib1uwzRJ8HuK/WcG1Ny4ht7qO0kYW2eVVDMejODSTQTTArNttdDtVGG4Z6XQCgXBYMCeZqcvm70N3d7nf1ujc1pf/VKj5IFRn7Qi+3W4cWVicly+88DV9aXlO0nSFsOgwsxIWl26RPRbI3dsMPIpQyM/yy9CYXRcbUpbJFOyFUCjIQ/G8FKZqucj3LYyOBNkjy9jK3cLIqA9TMwmKWIAQk3Bg/zT2790HXTVQLdV4CAEriQcizZN6dVJsvVmS8oW1j6/mLnzJts/fQctOnmdFIVtSaighhSMBnlxCu1N3HmXKf2ZiBHumx/lBKio3kFlyt+ZioMRsv+9g182mlBi8x61zYxXhkIEDB8ZxfHYSs8cmMDUVJ5N0+Z021laXsLR4ixDahiq74JI10qUJs9sihJrsqQpqzQLavSrK9W1pI7v0yOp25Gu3g/2B4Fut+lNvvnnVFlmVKDaiSRVXn7wtGpZ8TIGJRf3wByjvMgvbFSzScg6huVxsIDJJuwdD01GvsOFoD2yLOG6V2QM6whGV1c0Tajk2MnDq5Awb0oOXX3oFN69dw+7MGCvnpW4APp+L9NuieG3AtGuoNrJY2bglFavZ95TqV+8S8e4IPjM7/De5fLa/sbmKckXwOCHD7CuqhVQ6jMXFBVJjEWNjKVh2h1kmZFTCkKbF7tMeEJIqGaRRbcAiNS6zP3LEeYwi1eMha5UiQkEDkZAHI+kIRoej1AEqsk/B9NQoggE3Bc1L7Edw6PAURsfiKFW2sbo+h1ojR/gUaAA35Hav9FER744GEA3xwQ+fyDfbxcjsuUmEEipqtSozC6TYoCWarkgkyCwGWKUmWs0GFbJIrHtIk2Him9nnZ3WXAk2VHUbqUG1DpEuvl9Ug1TbJIpqmUJHBXjIYEPD1r7+OPVP7EQgkUCK/K+whVelSdUvIbq2wch2MDY0gFtyFoHcYU+PHW8nUgcmdPB+oRnTDeiw1EpVk0l+332DWZefR5qbpdBwjI2kBL7IAm5TkKQ6n0gIEAyF43R74vX7EoxH0abrcLg+GUqPwe8Jo0qz1exIP5WY/eNgPAnoy/DxYOOzH8Egc9Pww+P1CkRa7lOXrPhhU9O1s3tGFoD/CvQzuE3FFA8n1HcEfP7vn8/FkYO/QKLnbK6wsxd/qM3ttYtBAIhGmsIhy0QTQy5TpGtdXN3lBBclEgs3LCxteNi8pktrg90Zh9eh1aqS+jszP+QgtjZWkXWAwJHj2UpPQJNOxKbu9FpNEdmE5CjRrNA/cjL3X6pKtKvRGBv1/Bon4GDx6sLYj+KlDqSdttRdwE4MNdrpp9Rg88cwDkFCIT+FNWJHO7Sa1qJoqMTVKPUjEksyol9UQxqvvKG2vI2F1OYdvvvQqclsVHpYN3u46MHMbGq/fQbVZRafXILsIhjGJ6R5MU3LYrNPpOLOArntICAZ7huavp2Pv9FFCaOTpO8E7Pj3ae9zjU+Vmp8KG7DtevEMLIGDjIo7NXocX5oH4upvsYjPDBrM9PDTsBO4EzyFDVfkePYtlsnlrJiqFNm2+zgQYjpdXmAmDPSCsdHNAxYK1bM4CzabC6uikXTg9FAyGWEnC0h9j9VzI51vYkzmEaHT0iTtsI4eqnw1HQ6rwLRZlu1rjxSyNWSKW+ejQFmxni8Q7AyGrmMy6xB+PYdBw0WQRBTItLriR2WPB+b5Ozo/FIjh97iROnz1OBplBkNRoUz07hIgYE120HX1OXu02KyvzPX4/xIDdQtlt0qWpkNH8fBaHF3ZZRi7PwzbNo07wn372z0bGx3f9qsjw0vIitrY24GHjiEzlcmXMz6/iyuW3cO3akmNfRWZF+RViXUDAxelIEm6ROG832Zh0jRarki/kabw0p7lduuw4zbFMGgnSrlBnmXZZUXQeguJkUdS0IPy+EBrEfJt6YfEgWcLN7KqoVvooFTqM1ktG8/LZnXGC52bvDwYDSoh87PUaaHCI7vDLxUINa2tZZ3Deu3ea/iVDqoxwI5uvqTygl1VhExLpCj9zuz94eZ+P/FzBxde+6+iCJ0Ao0aNArvMA1ALdhKSaxDNbn4e2TI0BBZh1g6IVJ1TCTvVWV7ZQzNfYY0A+V+Pf22QriqQ3Qki5bzjBW6YZevmll3Dx4nfg83qQJqfrmsbTd1DIl5kZmqbUCDt9lK97nDsAgWDA8eAuVsEZNATWmUWPN0jcduhdhnH06F0cXmTOAh1iugjZRaFqbGNtY56yXxacRcgwAGZeZLPRIEsxaHHN9Y1NbGzmyHBpVlgj27Eq3M/NvlJoJdh2607w956e/cdKqdi58cZVmBwugmKo6Nf4RZ1BRHD92k189d/+E4XtGnycdPpd8n6jwyGkwsDJHpx6RIa++PwFXPjyt6B0aYclN/z07Z06edJu0drqzLIIvoxytUQKJLTIYuxRcrnLsQSMGR27i9XcJnzkeN2jsvvacLn7iCcMwk+QRxmawYFfazFdXM8990/1hx46UQqF9Ifj9C5CICQO1ppXxsTEGAIUEp/Hi9HRUWaIQkO82vTgHVYmEgpha7OEi69eJmXuwV2HZnlwQoQ0qxAWijrQC3J2r99iD6gcVKLwB4POdFVjD7UEvgk3UYQO/XCdFCm05XZDKw4K8rlt+qY29uyexMzUXou98fQdtqEzCe0aHXdKXqs2HeyLDYslMepVHc5v0g4Uy2VqQJtsYXLTDiGwictXriAUCePI7F3QPBpiHBvDsRhiCTEOhvlZIUaCeulHGaRJGBY5eOeLNVRqbec98ahyHOx06Cr5KBW5Jz8s/m4xpsJ2iRX2YXJyik0dLHT69k0n88LTzC9c+sJYZthXqRYRjQVQ71Wg+wUbkKrI6VWOZXVCIJagRNOM+QMe4tV2eHubjNTlJv/8L/9KE7WKw4f3M+AuGhSztkltEPduPG6HxwuEWr5UYVIEt3M2k2ipqRUSh3IxRZUqTb6mki7DrGqEapp0bIZDof44Du0/Svsx9Jdp//4vO8EPD0czo2Op39u3b0ouMdPLq4vwRBQOT7QGxHTA7+eBos4tDF3XnDtjCmlOeBPRXOEIR0Vmrs8yP/zIw7eVslrmsM7GIv3kad7aHAfFo0mKFRVoddisHMCbDLhOM1atdUitVTKdoEOV9Mj5gCZb+CGzK6iXs0EgjrGRSR4q+UefevwzCw5sqGLKygrHNE4yfpqfeCztGK1Ot00eZ6NxKKs1KoRLg80m5soQM0WWEbcuOIArxOTCygp27d6FGo3M629ewfW5Rb62gSs3buHV1y7jjSs3sU6Ra3BQb7ZtQsdFnvfQz1B0Ck1HeErlpkODQuyK+Qr7iuaPn1PY/BR3Ryx1zWu7FLUh4nYsMWEjf+bZP9+gLiVVtcdGteCKVbCcv0ZxqPMipDuWUqMadmlxhbIKV6jQ1/goUjKp63sXX2djKg59VuhhesycThax2CuiX4ZGEmSMCBNhOypNxBGOFEFiuUDT5Xb7HD1pUdmFbjQaLcdu9Aktiwf0eoJ4z70P4djBk1W/Gh0LhzNlJ/OSJFn3nL3/Lp8vXF9fy9mvfue/KL8W7ewYYeFmySjoDLrf77EyXma8x2GlwmCZfbJDudbAzIH9zm2MbKEI3euDy6AesDl1GrRdmQlEE8O02AoqVbrRKhuQ2V5eyWJubp1CWGDzC/y76Y00WugQkxDFxloeK4tbjsE7feIeHDl8oukLRO4RgYu477DNgQMntz70yEcD0djQ8wF/wo5GhsldGh/MuEqjxBpZpEfnlkSjzoYTrNMRNy+YWSpgkYchr4vpn/oJi9bB5lTlondXmcE6bUOOil1gVcrlNpmli83NMq9HOtT8vDZJoULTBp0Wo4/CVpmzsAujQxO47573YvbIOTNgRH8zok9cGoT8P8GLxQrYhuH/Y58nahazHWRXGgi4E06XW1S+FkvpJlwaNQZRKJGjGyy7uCdvsolNh/5swkv0g4BFj3ahyQNmCY31jRwdYYWs1SJsTHp0i3Bz0x2mEApEHZ/f5UFAnG/SkiwvriMi2OXQccwePWOHQ4nfDxuZzw1CddaO4MU6PbvvrWgksZRdr9trixX43XHEQ0OIhuLOYG3oLkQjIfaBhRvX57CwsEojl3dMnAhGCE6HdkGYLq8vQA8jbmmTy+lKhbW1aJVpdvl9FzEdZEV1+hQvBa9PQ0Z6rbaRCKec/YI81PTkAe4Z2DYrxtMC3rejvL3eFnwmc3/7vrPvu29m4silsDGKmd2z2D22F3smponDgKN0gjIPHdrHRgfN0iY21/MUlTqbKswLUtyEWpIihUKK23wshTBSThXEQQWrCRKoszkbFCYv/dDS0hoPImZXHUIsx0ZoAoMx7OJz0Bd7Mp1OOwzzv9fbghdrbGzvxoP3XDtmyMl1q+XCxVcu4dJrV8izIYpHgEpHI8LgxsdGMUm5HuVmfi+VlFDokpPbHXI61dek6yJy+Czu4QtB6xJqLXK3DYPsUq028O1XLmL+1gJOHD+FVDLtiFOhUHYo+8zpexAJxG4mAtVPD0Lbse5MUj+4PvnJb9inT57ds7m1Mru1tYQq3eDIroRzv0bAQPxfSXN5mVF6Icq8zIz1+xKSDOCtuRvk7W2HTt1uN/HNSYOHMNi8PvJxgElo1FusQAUBQiufK2Du1jxtQQ/dRht19s7uzBQevP+hLoehu92uTG4Q1o7l8PyPWtevX5+NxJV/L1TfCn/xK3+rjk2GJbdfwvLaKp2g3xnJmpxsxF3iLieeicwkESKjVNsks2zxIAna6CHOrlXyvvj3jtAJWgDCRki/0IJvv/JdnDlzzvnnWjqRwvSu3Th17BRN3nhb1Ty/EzaGnxuE87b1Y4P//lq31z3PP/P4P+g+60N7941J5VrBscOCOdZW82zcRWJ2E9NT+4XBg+YDjp44TBiksJXNcnBucGykqhIuttAFHiYWTZIqs1hcWKEXOoJ7770fZ06cg6uvNanZnwh4Y0+xQXuDEH7oekfBi/Xii58de/WNb8898Avn1HgixPFwy3F7L7/8LbJBiE2c5EGybFaar9oWTVkNw7TQhw4cdij1jdcvO5menJzGnqkZxzHOvbWAdHoYJ0+dsVPR1C3T6v9Kwjfy+mDLn7jecfBiPff3n/y7YNj4cIiDgsdwY319g48tnD55tz08NL5MNV4jPaaK9VzqyrUrnvmFBVn8r6larTuHShAWwYC49Uf7y2pMsNnPnb67q8jqI8nQ8AuDbd7xelfBCw/0pa88u7Wdz8ZFB3poAQ4evMsaHxv/VNCnPiZJGXbm7WXbV7VLt8q/sbK8/mmW3zU9NU3Dl2wVaVs3NrY0XTM8I8OjS5yDPxgyQvODr72r9a6CF+vq1ata3659QlWVj8SiiZ7mUj8SDo+8OHj7bYsHVrcr2+NuyV0KBoOFwWtiX55pp+j8DC3gvwHnsgfJw63RuwAAAABJRU5ErkJggg==";
    const tree4 = getTree("Tree 4", tree4Thumbnail, caption);

    const tree5Thumbnail = "data:image/png;base64,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";
    const tree5 = getTree("Tree 5", tree5Thumbnail, caption);

    const tree6Thumbnail = "data:image/png;base64,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";
    const tree6 = getTree("Tree 6", tree6Thumbnail, caption);

    const tree7Thumbnail = "data:image/png;base64,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";
    const tree7 = getTree("Tree 7", tree7Thumbnail, caption);

    const tree8Thumbnail = "data:image/png;base64,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";
    const tree8 = getTree("Tree 8", tree8Thumbnail, caption);

    const shrubThumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAA69JREFUSEvN139MlHUcwPH3gwcdd3o/4CAOiJv0C6VuEjXGmJQLLglJhqHZ5spF/zj+qdmWq6XVdK0/NBWGbTCmTltkmnNNuLWkNjGppUIiMLiDu6s74c6TO+6O4w6uod2MmQ+znqbf7fnjefZ9vq99vp9nz+fzFbhHQ7hHLrfDdTwHNy4pRyfNdP59wflwHWf+BzTuzeGr4je34DeoRaBtx5pqHpTJCUwGuHLpIs8/W4hWk4rL6aG3d4DkZAVarQbD0mwcTiuj9hGKiowszTVw9tx5Av4pCgoK8PmDBEMzTIWnueh003KhG2Ksp4Wv5vBbcB07gO37Kl4lf1k+HafNxGavU2DMYtIfQpG8hP4+KwkJSYTCYYqKnyEmRDCbv2PNS+VYLFZcLg+5ublotTomfBNMz0yjVCoYtvv4uMs8531I8w3ndniL4WmeWlFI3cnPJclx64Ya3N4E3jEfE4dr5NnIZQ9wdHL45sT/NrbvrSgjEktha3ubOFwZU5OqVXPoum3exLv2/0pdY1UFV90zfHRuga3eVVKCPl3H5hMnJYH3mExcHnDQPNonHnFTZRm6FBW1h49LAu9bXcXVaz52dv8gDh/Z8CJKRSLVrVJFXE1wKsR7P3aIw8dfq0W1WE5Z42FJIt6Ss4JH8h7mbfPX4nDbxlp8Xg917d9LAm97ohylSs77XafE4appJTlZGhrHf5cE3lm0DofTQZPtvDj8QV4RXs84+8ctksAbFcuRK+W0jv8qDp/aVI88SaC8Zb8k8O6SGiyuP2gY/kkcPli5iXSdmoqDDZLAe1dWEVok493OE+Jwx5vbcDpGef30UUngphde5tKgjQPWbnF4vewh+q+46Hk0Ign8mWkt/UNuDljOisOl1xaj12v4MuyQBK5/3EhiYiZ7fmsXhzenGdFnaNnVO/8X92+LRP2ThSQJGezu+VYcfmt5KS6nnS+8VknK4tbilUxNJNPQt0B1+tS0jl9+7qbNa7/rIP/phfqCYnzuGQ7ZF/i4PjGtJUGIEgh5ecyQzWwgyFQoit0+RoxEVOpURmwOtKkpuL0edOlpqLUarFYHGRk5DA6OIJMpSNEvIRD1IBNkhP2zNA913XGr51raM6/kGSk1LiMtTc2imSgRfwDLkB2HY4zMTAMJMjmjNjuZWVnMCjFUGhWRaJRgKMLkZISengFStOno9Bqm8SPMCowFg3xjuzAHr4q3ufdBextP0M02N1+SBMcXiXE53tbGH91HRxhJQ73zYn8CtySzLs8hCPYAAAAASUVORK5CYII=";
    const shrubImage = "data:image/png;base64,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";
    const shrub = {
        "ref": {
            "versionId": 1,
            "name": "Shrub"
        },
        "thumbnailSrc": shrubThumbnail,
        "fills": [],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "TileStroke"
                    },
                    {
                        "key": "TileImageSource",
                        "value": shrubImage
                    },
                    {
                        "key": "Width",
                        "value": 10
                    }
                ]
            },
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#006400"
                    },
                    {
                        "key": "Width",
                        "value": 12
                    }
                ]
            }
        ],
        "defaultZGroup": 2
    };

    const mapData = {
        ref: {
            versionId: 1,
            isBuiltIn: true,
            name: "Locale"
        },
        thumbnailSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFNSURBVEhL7dK9SgNBFMXxfSNfwMrORjsR24iFIIKN2FmLjaUPoHXewGewU+xELNIIip0wehZOuFzPnY8d0CYLf7I7O8lvZyfD28s8/Ucr+M9qhmcbazI1N1cTHCFT8Gb4/nI/vKfGo6phrgqwwnnfj6sOr17TcHu8nZCawDyaw/0YAuRbwhHuUZ7bT2Tn8hoR4jUbLk5m6fxgR+L8EYvy2o+r70UoGm4WX+loa33EPz/ew9UrzJ4jO3/37G5E8WnH2Qij56eHhNXn8JaKcPo5LM7V98BEs/D14wL2Eke9eGm1aIQVjj2b+sqbYI/bVbc+QDNcg0cBYaX9Rb9gheO1Rw+gwBKKJIwsbh/Ap8ASikIYeVzlwRoUZWHEQ6GoFWRFmPmDMF4391sBUdWwzcL+n68Q1SQY9eKTYdSDd8HI4i37vYKbs/Dp3mYlPE/fwsxix1CYIsYAAAAASUVORK5CYII=",
        layers: [
            {
                name: "Background",
                "mapItemGroups": getBackgroundMapItemGroups("Land background")
            },
            {
                name: "Primary"
            },
            {
                name: "Texture",
                "mapItemGroups": getBackgroundMapItemGroups("Texture")
            },
        ],
        activeLayer: "Primary",
        mapItemTemplateRefs: [
            land.ref, grass.ref, snow.ref, pavement.ref, water.ref,
            contour.ref, fence.ref, shrub.ref,
            stoneStructure.ref, structure1.ref, structure2.ref, structure3.ref, structure4.ref,
            structure5.ref, structure6.ref, structure7.ref,
            tree1.ref, tree2.ref, tree3.ref, tree4.ref, tree5.ref,
            tree6.ref, tree7.ref, tree8.ref, 
            landBackground.ref, waterBackground.ref, texture.ref
        ],
        mapItemTemplates: [
            land, grass, snow, pavement, water,
            contour, fence, shrub,
            stoneStructure, structure1, structure2, structure3, structure4,
            structure5, structure6, structure7,
            tree1, tree2, tree3, tree4, tree5, 
            tree6, tree7, tree8, 
            landBackground, waterBackground, texture
        ],
        toolPalette: {
            editingToolPalettes: [
                [
                    { versionId: 1, isBuiltIn: true, name: "Select path" },
                    { versionId: 1, isBuiltIn: true, name: "Select rectangle" },
                    { versionId: 1, isBuiltIn: true, name: "Pan" },
                    { versionId: 1, isBuiltIn: true, name: "Zoom" }
                ],
                [
                    { versionId: 1, isBuiltIn: true, name: "Clip path" },
                    { versionId: 1, isBuiltIn: true, name: "Clip rectangle" },
                    { versionId: 1, isBuiltIn: true, name: "Clip ellipse" }
                ],
                [
                    { versionId: 1, isBuiltIn: true, name: "Edit transits" },
                    { versionId: 1, isBuiltIn: true, name: "Fit selection" }
                ]
            ],
            drawingToolPalettes: [
                [
                    { versionId: 1, isBuiltIn: true, name: "Draw point" },
                    { versionId: 1, isBuiltIn: true, name: "Draw path" },
                    { versionId: 1, isBuiltIn: true, name: "Draw rectangle" },
                    { versionId: 1, isBuiltIn: true, name: "Draw ellipse" },
                    { versionId: 1, isBuiltIn: true, name: "Draw arc" },
                    { versionId: 1, isBuiltIn: true, name: "Draw polytransit" }
                ]
            ],
            mapItemTemplatePalettes: [
                [land.ref, grass.ref, snow.ref, pavement.ref, water.ref],
                [contour.ref, fence.ref, shrub.ref],
                [stoneStructure.ref, structure1.ref, structure2.ref, structure3.ref, structure4.ref],
                [structure5.ref, structure6.ref, structure7.ref],
                [tree1.ref, tree2.ref, tree3.ref, tree4.ref, tree5.ref],
                [tree6.ref, tree7.ref, tree8.ref],
                [landBackground.ref, waterBackground.ref, texture.ref]
            ]
        }
    };
    return new Map(mapData);
}

function getBackgroundMapItemGroups(mapItemTemplateName) {
    return [
        {
            "mapItems": [
                {
                    "paths": [
                        {
                            "start": { "x": -1090, "y": -690 },
                            "transits": [
                                { "x": 3300, "y": 0 },
                                { "x": 0, "y": 2100 },
                                { "x": -3300, "y": 0 },
                                { "x": 0, "y": -2100 }
                            ]
                        }
                    ],
                    "mapItemTemplateRef": {
                        "versionId": 1,
                        "isBuiltIn": false,
                        "isFromTemplate": true,
                        "name": mapItemTemplateName
                    }
                }
            ]
        }
    ];
}

function getStructure(name, thumbnail, fillColor, caption) {
    return {
        "ref": {
            "versionId": 1,
            "name": name
        },
        "thumbnailSrc": thumbnail,
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorFill"
                    },
                    {
                        "key": "Color",
                        "value": fillColor
                    }
                ]
            }
        ],
        "strokes": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ColorStroke"
                    },
                    {
                        "key": "Color",
                        "value": "#202020"
                    },
                    {
                        "key": "Width",
                        "value": 3
                    }
                ]
            }
        ],
        "defaultZGroup": 3,
        "caption": caption
    };
}

function getTree(name, thumbnail, caption) {
    return {
        "ref": {
            "versionId": 1,
            "name": name
        },
        "thumbnailSrc": thumbnail,
        "fills": [
            {
                "options": [
                    {
                        "key": "PathStyleType",
                        "value": "ImageArrayFill"
                    },
                    {
                        "key": "ImageArrayOffsets",
                        "value": [5]
                    },
                    {
                        "key": "ImageArraySource1",
                        "value": thumbnail
                    }
                ]
            }
        ],
        "strokes": [],
        "defaultZGroup": 4,
        "caption": caption
    };
}
