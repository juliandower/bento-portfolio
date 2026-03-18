import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

jest.mock('framer-motion', () => {
  const ReactRuntime: any = require('react');
  const motionProps = new Set([
    'animate',
    'exit',
    'initial',
    'layout',
    'layoutId',
    'transition',
    'variants',
    'viewport',
    'whileHover',
    'whileInView',
    'whileTap',
  ]);

  return {
    motion: new Proxy(
      {},
      {
        get: (_, tag) =>
          ReactRuntime.forwardRef((props: any, ref: any) => {
            const cleanProps = Object.entries(props).reduce(
              (acc, [key, value]) => {
                if (!motionProps.has(key)) {
                  acc[key] = value;
                }

                return acc;
              },
              {} as Record<string, unknown>
            );

            return (
              ReactRuntime.createElement(
                tag as string,
                { ref, ...cleanProps },
                props.children
              )
            );
          })
      }
    ),
  };
});

const renderApp = () =>
  render(
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <App />
    </BrowserRouter>
  );

describe('App routes', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  test('renders the home page with Julian Dower and the wissenwert link', () => {
    renderApp();

    expect(
      screen.getByRole('heading', {
        name: /fluid digital work across software, music, and design/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /julian dower/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /view wissenwert/i })
    ).toHaveAttribute('href', 'https://github.com/juliandower/wissenwert');
  });

  test('redirects /portfolio to the home experience', () => {
    window.history.pushState({}, '', '/portfolio');

    renderApp();

    expect(
      screen.getByRole('heading', {
        name: /fluid digital work across software, music, and design/i,
      })
    ).toBeInTheDocument();
  });

  test('renders the contact page', () => {
    window.history.pushState({}, '', '/contact');

    renderApp();

    expect(
      screen.getByRole('heading', {
        name: /reach out if the project needs both taste and build quality/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /dower\.julian@gmail\.com/i })
    ).toBeInTheDocument();
  });
});
