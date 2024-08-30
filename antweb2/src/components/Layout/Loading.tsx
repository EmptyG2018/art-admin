import { theme } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  loading: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  `,
}));

const Loading = () => {
  const { token } = theme.useToken();
  const { styles } = useStyles();

  return (
    <div className={styles.loading}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="84"
        height="84"
      >
        <g>
          <path
            stroke-linecap="round"
            d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
            stroke-dasharray="42.76482137044271 42.76482137044271"
            stroke-width="8"
            stroke={token.colorPrimary}
            fill="none"
          >
            <animate
              values="0;256.58892822265625"
              keyTimes="0;1"
              dur="1s"
              repeatCount="indefinite"
              attributeName="stroke-dashoffset"
            ></animate>
          </path>
          <g></g>
        </g>
      </svg>
    </div>
  );
};

export default Loading;
