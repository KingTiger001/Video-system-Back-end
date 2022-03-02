import Head from "next/head";
import Button from "@/components/Button";
import {useRouter} from "next/router";
import {useEffect} from "react";

const SuccessPage = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => router.push('/app'), 10000);
        return () => clearTimeout(timer);
    });

    return  <div style={{
      padding: '21px 39px',
      background: 'white',
      height: '100vh',
      width: '100vw'
  }}>
      <Head>
          <title>Checkout | FOMO</title>
      </Head>

      <div style={{
          display: 'flex',
          marginLeft: '10px',
          alignItems: 'center',
          gap: '110px',
          marginBottom: '68px',
      }}>
          <img src='/assets/socials/myfomo_logopurple.svg' width='30px' height='30px'/>
      </div>

      <div style={{
          margin: '0 auto'
      }}>
          <p style={{
              color: '#5D7183',
              fontSize: '16px',
              width: '320px',
              textAlign: 'center',
              margin: '0 auto',
              fontWeight: '600'
          }}>You will be automatically redirected to your dashboard in 10 sec</p>
      </div>
      <br/><br/><br/><br/>

      <div style={{
          margin: '0 auto'
      }}>
          <p style={{
              color: '#444',
              fontSize: '20px',
              width: '320px',
              textAlign: 'center',
              margin: '0 auto',
              fontWeight: '600'
          }}>Payment successful</p>
      </div>
      <br/><br/><br/>
      <div style={{
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center'
      }}>

          <img src="/assets/socials/success-check.png" alt="success" width='50px' height='50px' style={{borderRadius: '50%'}}/>

      </div>
        <br/><br/><br/>
      <div style={{
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center'
      }}>

          <Button
              onClick={async () => {
                  await router.push('/app');
              }}
          >
              Back to Dashboard
          </Button>
      </div>
  </div>
}

export default SuccessPage;
