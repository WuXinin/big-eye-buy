import clsx from "clsx";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Component, ComponentType } from "../../types/Util";
import { useRandom, useRandoms } from "../../util";
import "./LoaderSkeleton.css";

export type LoaderSkeletonProps = {
  component?: ComponentType;
  variant?: "text" | "block" | "none";
  loadStyles?: Record<string, any>;
  loadElement?: JSX.Element;
  loadClass?: string;
  full?: boolean;
  length?: number;
  invisible?: boolean;
  loading: boolean;
  [key: string]: any;
} & React.HTMLAttributes<HTMLElement>;

const LoaderSkeleton: Component<LoaderSkeletonProps> = ({
  component,
  children,
  loadStyles,
  style,
  loadElement,
  variant,
  loadClass = {},
  full,
  length,
  invisible,
  loading,
  ...others
}) => {
  const compRef = useRef<HTMLElement>();

  useEffect(() => {
    let comp = compRef.current;
    if (!comp) return;
    const { height } = comp.getBoundingClientRect();
    const style = getComputedStyle(comp);
    setHeights({
      height: `${height}px`,
      line: style.lineHeight,
    });
  }, [compRef.current]);

  const [heights, setHeights] = useState({
    line: "1.5em",
    height: "1em",
  });

  const allowedLoaderElements: (keyof JSX.IntrinsicElements)[] = [
    "a",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "label",
    "span",
  ];

  let allowedComponent = allowedLoaderElements.includes(
    component as keyof JSX.IntrinsicElements
  );

  let newVariant =
    variant === undefined ? (allowedComponent ? "text" : "block") : variant;

  const LoadingComponent = (
    allowedComponent ? component : "div"
  ) as Component<any>;

  const Comp = component as Component<any>;

  const random = useRandom(3, 7);

  const margin =
    newVariant === "text" && `calc((${heights.line} - ${heights.height}) / 2)`;

  return (
    <div>
      {loadElement !== undefined && loading && (
        <LoadingComponent
          ref={(el: HTMLElement) => (compRef.current = el)}
          className={clsx(
            "loadable",
            "transform",
            newVariant,
            loadClass,
            others.className,
            {
              full: full,
              invisible: invisible,
            }
          )}
          style={{
            "--length": `${length || random}em`,
            marginTop: margin,
            marginBottom: margin,
            ...loadStyles,
            ...style,
          }}
        >
          {loadElement}
        </LoadingComponent>
      )}
      {loading && (
        <LoadingComponent
          ref={(el: HTMLElement) => (compRef.current = el)}
          className={clsx(
            "loadable",
            "transform",
            newVariant,
            loadClass,
            others.className,
            {
              full: full,
              invisible: invisible,
            }
          )}
          style={{
            "--length": `${length || random}em`,
            marginTop: margin,
            marginBottom: margin,
            ...loadStyles,
            ...style,
          }}
        />
      )}
      {!component && !loading && children}
      {component && !loading && (
        <Comp {...others} style={style} component={component}>
          {children}
        </Comp>
      )}
    </div>
  );
};

export default LoaderSkeleton;
