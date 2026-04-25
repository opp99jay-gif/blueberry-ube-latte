'use client';

import { useEffect, useRef } from 'react';

// Declare ShopifyBuy on the window object to avoid TypeScript errors
declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

interface ShopifyBuyButtonProps {
  storeDomain?: string;
  storefrontAccessToken?: string;
  productId?: string;
}

export default function ShopifyBuyButton({
  storeDomain = 'YOUR_STORE_DOMAIN.myshopify.com', // e.g., 'my-blueberry-ube-latte.myshopify.com'
  storefrontAccessToken = 'YOUR_STOREFRONT_ACCESS_TOKEN', 
  productId = 'YOUR_PRODUCT_ID'
}: ShopifyBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on the client
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Prevent double initialization in strict mode or re-renders
    if (containerRef.current.hasChildNodes()) return;

    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    function ShopifyBuyInit() {
      const client = window.ShopifyBuy.buildClient({
        domain: storeDomain,
        storefrontAccessToken: storefrontAccessToken,
      });

      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        ui.createComponent('product', {
          id: productId,
          node: containerRef.current,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            "product": {
              "iframe": false, // Render directly to allow better styling or keep true for strict isolation
              "contents": {
                "img": false,
                "title": false,
                "price": false,
                "options": false
              },
              "styles": {
                "button": {
                  "font-family": "Inter, sans-serif",
                  "font-size": "20px",
                  "font-weight": "500",
                  "padding-top": "16px",
                  "padding-bottom": "16px",
                  "color": "#000000",
                  ":hover": {
                    "color": "#000000",
                    "background-color": "#f0f0f0",
                    "transform": "scale(1.05)",
                    "box-shadow": "0 0 30px rgba(147,112,219,0.6)"
                  },
                  "background-color": "#ffffff",
                  ":focus": {
                    "background-color": "#f0f0f0"
                  },
                  "border-radius": "40px",
                  "padding-left": "48px",
                  "padding-right": "48px",
                  "transition": "all 0.3s ease-in-out"
                }
              },
              "buttonDestination": "checkout",
              "text": {
                "button": "Buy Now"
              }
            },
            "cart": {
              "styles": {
                "button": {
                  "font-family": "Inter, sans-serif",
                  "font-size": "16px",
                  "padding-top": "16px",
                  "padding-bottom": "16px",
                  "background-color": "#9370DB",
                  ":hover": {
                    "background-color": "#8A2BE2"
                  },
                  ":focus": {
                    "background-color": "#8A2BE2"
                  },
                  "border-radius": "8px"
                }
              }
            }
          },
        });
      });
    }

    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      // Load script if not already loaded
      let script = document.querySelector(`script[src="${scriptURL}"]`) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        document.head.appendChild(script);
      }
      script.addEventListener('load', ShopifyBuyInit);
      return () => script.removeEventListener('load', ShopifyBuyInit);
    }
  }, [storeDomain, storefrontAccessToken, productId]);

  return <div ref={containerRef} className="shopify-buy-wrapper"></div>;
}
