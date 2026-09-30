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
    useReducedMotion: () => false,
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

  test('renders the portfolio home page and featured work', () => {
    renderApp();

    expect(
      screen.getByRole('heading', {
        name: /julian dower/i,
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/julian dower/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: /play wissenwert/i })
    ).toHaveAttribute('href', 'https://wissenwert.juliandower.com');
    expect(
      screen.getByRole('link', { name: /open wisp-anchor/i })
    ).toHaveAttribute('href', 'https://wisp-anchor.juliandower.com');
  });

  test('redirects /portfolio to the home experience', () => {
    window.history.pushState({}, '', '/portfolio');

    renderApp();

    expect(
      screen.getByRole('heading', {
        name: /julian dower/i,
      })
    ).toBeInTheDocument();
  });

  test('renders the contact page', () => {
    window.history.pushState({}, '', '/contact');

    renderApp();

    expect(
      screen.getByRole('heading', {
        name: /let’s talk/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /email dower\.julian@gmail\.com/i })
    ).toHaveAttribute('href', 'mailto:dower.julian@gmail.com');
  });
});
