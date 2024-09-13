export function DocumentUploadIcon(props: {
  height?: number
  className?: string
}) {
  const { className } = props

  const height = props.height ? props.height * 4 : 48
  const width = height * 1.25

  return (
    <svg
      className={className}
      width={width}
      height={height}
      version="1.1"
      viewBox="0 0 100 125"
      x="0px"
      y="0px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M40 54C40 52.8954 39.1046 52 38 52C36.8954 52 36 52.8954 36 54V59.3333C36 60.571 36.4917 61.758 37.3668 62.6332C38.242 63.5084 39.429 64 40.6667 64H59.3333C60.571 64 61.758 63.5083 62.6332 62.6332C63.5083 61.758 64 60.571 64 59.3333V54C64 52.8954 63.1046 52 62 52C60.8954 52 60 52.8954 60 54V59.3333C60 59.5102 59.9298 59.6797 59.8047 59.8048C59.6797 59.9298 59.5101 60 59.3333 60H40.6667C40.4899 60 40.3203 59.9298 40.1953 59.8048C40.0702 59.6797 40 59.5102 40 59.3333V54Z" />
      <path d="M50.7656 36.1518C51.0015 36.2494 51.2225 36.394 51.4142 36.5858L58.0809 43.2525C58.8619 44.0335 58.8619 45.2998 58.0809 46.0809C57.2998 46.8619 56.0335 46.8619 55.2525 46.0809L52 42.8284V54C52 55.1046 51.1046 56 50 56C48.8954 56 48 55.1046 48 54V42.8284L44.7475 46.0809C43.9665 46.8619 42.7002 46.8619 41.9191 46.0809C41.1381 45.2998 41.1381 44.0335 41.9191 43.2525L48.5839 36.5877C48.5896 36.582 48.5954 36.5762 48.6012 36.5705C48.9874 36.1925 49.4887 36.0023 49.9908 36C49.9938 36 49.9969 36 50 36C50.0031 36 50.0062 36 50.0092 36C50.2771 36.0012 50.5324 36.0551 50.7656 36.1518Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 16.3159C16 12.8081 18.8662 10.0001 22.3577 10.0001H67.9577L83.9976 28.1505V83.6843C83.9976 87.192 81.1314 90.0001 77.6398 90.0001H22.3577C18.8662 90.0001 16 87.192 16 83.6843V16.3159ZM22.3577 14.2106C21.1521 14.2106 20.2105 15.1728 20.2105 16.3159V83.6843C20.2105 84.8274 21.1521 85.7895 22.3577 85.7895H77.6398C78.8454 85.7895 79.787 84.8274 79.787 83.6843V31.0527H71.2192C67.7311 31.0527 64.9034 28.225 64.9034 24.7369V14.2106H22.3577ZM69.1139 17.6668L77.2223 26.8422H71.2192C70.0565 26.8422 69.1139 25.8996 69.1139 24.7369V17.6668Z"
      />
    </svg>
  )
}
