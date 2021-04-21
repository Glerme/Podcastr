import { GetStaticProps, NextPage } from "next";

type HomeProps = {
  episodes: Array<Episode>;
};

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  };
};

const Home: NextPage<HomeProps> = ({ episodes }) => {
  console.log(episodes);

  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(episodes)}</p>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
};

export default Home;
