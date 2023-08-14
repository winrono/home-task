import { PortchainService } from 'integrations/portchain-api';

async function main() {
    const service = await PortchainService.create();

    const [
        topPorts,
        bottomPorts,
        percentile5th,
        percentile20th,
        percentile50th,
        percentile75th,
        percentile90th,
    ] = await Promise.all([
        service.getTopPorts(5),
        service.getBottomPorts(5),
        service.getPortCallDurationPercentiles(5),
        service.getPortCallDurationPercentiles(20),
        service.getPortCallDurationPercentiles(50),
        service.getPortCallDurationPercentiles(75),
        service.getPortCallDurationPercentiles(90),
    ]);

    console.log('Top 5 ports:');
    console.log(topPorts);

    console.log(`Bottom 5 ports:`);
    console.log(bottomPorts);

    console.log('5th percentile:');
    console.log(percentile5th);

    console.log('20th percentile:')
    console.log(percentile20th);

    console.log('50th percentile:');
    console.log(percentile50th);

    console.log('75th percentile:');
    console.log(percentile75th);

    console.log('90th percentile:');
    console.log(percentile90th);
}

main().catch(error => {
    console.error(`Unhandled error occured: `, error);
})