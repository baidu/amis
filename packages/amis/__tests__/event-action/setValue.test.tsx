import {render, cleanup, fireEvent} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {wait, makeEnv} from '../helper';
import {clearStoresCache} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

const execTest = (
  mode: 'merge' | 'override',
  {name, initData, setData, except}: any
) => {
  test(`EventAction:setValue:${mode}Mode:${name}`, async () => {
    const onSubmit = jest.fn();
    const {container, getByText, findByText} = render(
      amisRender(
        {
          type: 'form',
          id: 'theForm',
          title: 'The form',
          data: initData,
          controls: [
            {
              type: 'button',
              label: 'SetValue',
              onEvent: {
                click: {
                  actions: [
                    {
                      dataMergeMode: mode,
                      actionType: 'setValue',
                      componentId: 'theForm',
                      args: {
                        value: setData
                      }
                    }
                  ]
                }
              }
            }
          ],
          submitText: 'Submit'
        },
        {
          onSubmit: onSubmit
        },
        makeEnv()
      )
    );

    fireEvent.click(await findByText(/SetValue/));
    await wait(500);
    fireEvent.click(getByText(/Submit/));
    await wait(200);

    expect(onSubmit).toBeCalled();
    expect(onSubmit.mock.calls[0][0]).toMatchObject(except);
  });
};

const mergeCases = [
  {
    name: 'normal',
    initData: {
      a: 1,
      x: 2
    },
    setData: {
      a: 2
    },
    except: {
      a: 2,
      x: 2
    }
  },
  {
    name: 'setArray',
    initData: {
      a: [1],
      x: 2
    },
    setData: {
      a: [2]
    },
    except: {
      a: [2],
      x: 2
    }
  },
  {
    name: 'setDeepKeyWithPath',
    initData: {
      a: {
        c: 3,
        b: 1
      },
      x: 2
    },
    setData: {
      'a.b': 2
    },
    except: {
      a: {
        c: 3,
        b: 2
      },
      x: 2
    }
  },
  {
    name: 'setDeepKeyWithObj',
    initData: {
      a: {
        c: 3,
        b: 1
      },
      x: 2
    },
    setData: {
      a: {
        b: 2
      }
    },
    except: {
      a: {
        b: 2
      },
      x: 2
    }
  },
  {
    name: 'setByPathKey',
    initData: {
      a: {
        b: {
          e: 1
        },
        c: 3
      },
      x: 2
    },
    setData: {
      'a.b': {f: 2}
    },
    except: {
      a: {
        b: {
          f: 2
        },
        c: 3
      },
      x: 2
    }
  },
  {
    name: 'replaceOneLevelObj',
    initData: {
      a: {
        b: {
          e: 1
        },
        c: 3
      },
      x: 2
    },
    setData: {
      a: {
        b: {
          f: 2
        }
      }
    },
    except: {
      a: {
        b: {
          f: 2
        }
      },
      x: 2
    }
  },
  {
    name: 'setArrayWithPath',
    initData: {
      a: {
        b: [
          {
            id: 1,
            name: 1
          },
          {
            id: 2,
            name: 2
          }
        ]
      },
      x: 2
    },
    setData: {
      'a.b[1].id': 3
    },
    except: {
      a: {
        b: [
          {
            id: 1,
            name: 1
          },
          {
            id: 3,
            name: 2
          }
        ]
      },
      x: 2
    }
  },
  {
    name: 'setArrayItemWithPath',
    initData: {
      a: {
        b: [
          {
            id: 1,
            name: 1
          },
          {
            id: 2,
            name: 2
          }
        ]
      },
      x: 2
    },
    setData: {
      'a.b[1]': {
        id: 3
      }
    },
    except: {
      a: {
        b: [
          {
            id: 1,
            name: 1
          },
          {
            id: 3
          }
        ]
      },
      x: 2
    }
  },
  {
    name: 'replaceArray',
    initData: {
      a: {
        b: [
          {
            id: 1,
            name: 1
          },
          {
            id: 2,
            name: 2
          }
        ]
      },
      x: 2
    },
    setData: {
      a: {
        b: [
          {
            id: 3,
            name: 3
          }
        ]
      }
    },
    except: {
      a: {
        b: [
          {
            id: 3,
            name: 3
          }
        ]
      },
      x: 2
    }
  },
  {
    name: 'setUndefined',
    initData: {
      a: 1
    },
    setData: {
      a: undefined
    },
    except: {
      a: undefined
    }
  }
];

const overrideCases = [
  {
    name: 'normal',
    initData: {
      a: 1,
      x: 2
    },
    setData: {
      a: 2
    },
    except: {
      a: 2
    }
  },
  {
    name: 'setArray',
    initData: {
      a: [1],
      x: 2
    },
    setData: {
      a: [2]
    },
    except: {
      a: [2]
    }
  },
  {
    name: 'setDeepKeyWithPath',
    initData: {
      a: {
        c: 3,
        b: 1
      },
      x: 2
    },
    setData: {
      'a.b': 2
    },
    except: {
      a: {
        b: 2
      }
    }
  },
  {
    name: 'setDeepKeyWithObj',
    initData: {
      a: {
        c: 3,
        b: 1
      },
      x: 2
    },
    setData: {
      a: {
        b: 2
      }
    },
    except: {
      a: {
        b: 2
      }
    }
  },
  {
    name: 'setByPathKey',
    initData: {
      a: {
        b: {
          e: 1
        },
        c: 3
      },
      x: 2
    },
    setData: {
      'a.b': {f: 2}
    },
    except: {
      a: {
        b: {
          f: 2
        }
      }
    }
  },
  {
    name: 'replaceOneLevelObj',
    initData: {
      a: {
        b: {
          e: 1
        },
        c: 3
      },
      x: 2
    },
    setData: {
      a: {
        b: {
          f: 2
        }
      }
    },
    except: {
      a: {
        b: {
          f: 2
        }
      }
    }
  },
  {
    name: 'setArrayWithPath',
    initData: {
      a: {
        b: [
          {
            id: 1,
            name: 1
          },
          {
            id: 2,
            name: 2
          }
        ]
      },
      x: 2
    },
    setData: {
      'a.b[1].id': 3
    },
    except: {
      a: {
        b: [
          undefined,
          {
            id: 3
          }
        ]
      }
    }
  },
  {
    name: 'setArrayItemWithPath',
    initData: {
      a: {
        b: [
          {
            id: 1,
            name: 1
          },
          {
            id: 2,
            name: 2
          }
        ]
      },
      x: 2
    },
    setData: {
      'a.b[1].id': 3,
      'a.b[1].name': '3'
    },
    except: {
      a: {
        b: [
          undefined,
          {
            id: 3,
            name: '3'
          }
        ]
      }
    }
  },
  {
    name: 'replaceArrayByPath',
    initData: {
      a: {
        b: [
          {
            id: 1,
            name: 1
          },
          {
            id: 2,
            name: 2
          }
        ]
      },
      x: 2
    },
    setData: {
      'a.b[1]': {
        id: 3
      }
    },
    except: {
      a: {
        b: [
          undefined,
          {
            id: 3
          }
        ]
      }
    }
  },
  {
    name: 'replaceArrayByObj',
    initData: {
      a: {
        b: [
          {
            id: 1,
            name: 1
          },
          {
            id: 2,
            name: 2
          }
        ]
      },
      x: 2
    },
    setData: {
      a: {
        b: [
          {
            id: 3,
            name: 3
          }
        ]
      }
    },
    except: {
      a: {
        b: [
          {
            id: 3,
            name: 3
          }
        ]
      }
    }
  },
  {
    name: 'setUndefined',
    initData: {
      a: 1
    },
    setData: {
      a: undefined
    },
    except: {
      a: undefined
    }
  }
];

mergeCases.forEach(item => {
  execTest('merge', item);
});

overrideCases.forEach(item => {
  execTest('merge', item);
});
