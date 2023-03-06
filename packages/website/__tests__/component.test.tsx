import { BsPlus } from "solid-icons/bs";
import { cleanup, screen } from '@solidjs/testing-library';

afterEach(() => {
    cleanup();
})

test('new square has a plus sign', async () => {
    document.body.innerHTML = `
        <Square_New data-testid='add-flow'/>
    `
    // render(<Square_New data-testid='add-flow'/>, document);
    const add_square = screen.getByTestId('add-flow');
    
    expect(add_square).toBeInTheDocument();
    expect(add_square).toBeTruthy();
    expect(add_square).toContain(<BsPlus/>);
});

test('square file displays the correct text', async () => {
    document.body.innerHTML = `
        <Square_File data-testid="flow" title="test-flow-title" description="test-flow-description" />
    `
    const flow_square = screen.getByTestId('flow');

    expect(flow_square).toBeTruthy();
    expect(flow_square).toBeInTheDocument();
    expect(flow_square).toContainHTML('test-flow-title');
    expect(flow_square).toContainHTML('test-flow-description');
});