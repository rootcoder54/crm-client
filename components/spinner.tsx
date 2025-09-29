interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner = ({ size = 48, className }: SpinnerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="currentColor"
      aria-label="Loading"
      role="img"
      className={className}
    >
      <g>
        <circle cx="25" cy="5" r="3" />
        <circle cx="40" cy="25" r="3" />
        <circle cx="25" cy="45" r="3" />
        <circle cx="10" cy="25" r="3" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
};
