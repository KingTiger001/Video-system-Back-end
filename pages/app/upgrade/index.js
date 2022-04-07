import Head from "next/head";
import {useState} from "react";
import withAuth from "@/hocs/withAuth";
import AppLayout from "@/layouts/AppLayout";
import layoutStyles from "@/styles/layouts/App.module.sass";
import Plans from "@/components/Plans";
import Button from "@/components/Button";
import {useRouter} from "next/router";

const Upgrade = ({initialCampaignsDraft, initialCampaignsShared, me}) => {

    const router = useRouter();
    const [plan, setPlan] = useState({})
    const handleSelectPlan = (plan) => {
        setPlan(plan)
    }
    return (
        <AppLayout>
            <Head>
                <title>Upgrade | FOMO</title>
            </Head>

            <div className={layoutStyles.container}>
                {/* <p style={{
                    fontSize: '26px',color: '#4C4A60', fontWeight: '900px'
                }}>Upgrade your My Fomo plan</p> */}
                <div style={{
                    marginTop: '50px'
                }}>
                    <Plans
                        renderAction={(plan) => (
                            <Button
                                style={{
                                    background: '#FF5C00',
                                    color: 'white'
                                }}
                                onClick={async () => {
                                    handleSelectPlan(plan);
                                    await router.push('/app/upgrade/checkout')
                                }}
                                color='orange'
                                //outline={true}
                            >
                                Upgrade
                            </Button>
                        )}
                    />
                </div>

            </div>
        </AppLayout>
    );
};

export default withAuth(Upgrade);
