interface pageProps {
  params: Promise<{ id: string }>;
}

const PageClientIntervention = async ({ params }: pageProps) => {
      const { id } = await params;

    return (  );
}
 
export
 default PageClientIntervention;