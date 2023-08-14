import { PortchainApiClient, PortchainService } from 'integrations/portchain-api';

async function main() {
    let service: PortchainService;

    try {
        service = await PortchainService.create(new PortchainApiClient());
    } catch (e) {
        console.log(`Initialization error occured`);
        console.log(`Actual error is ${e}`);
        process.exit(1);
    }

    const topPorts = service.getTopPorts(5);
    const bottomPorts = service.getBottomPorts(5);
    const percentile5th = service.getPortCallDurationPercentiles(5);
    const percentile20th = service.getPortCallDurationPercentiles(20);
    const percentile50th = service.getPortCallDurationPercentiles(50);
    const percentile75th = service.getPortCallDurationPercentiles(75);
    const percentile90th = service.getPortCallDurationPercentiles(90);

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