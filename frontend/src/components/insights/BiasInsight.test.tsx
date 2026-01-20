import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BiasInsight } from './BiasInsight';
import type { ConsistencyCheckMetadata } from '../../types/spatial';

describe('BiasInsight', () => {
    const baseMetadata: ConsistencyCheckMetadata = {
        check_type: 'district_bias',
        affected_districts: ['District 03', 'District 04'],
        deviation_percentage: 50,
    };

    it('renders check type label', () => {
        render(<BiasInsight metadata={baseMetadata} />);

        expect(screen.getByText('District Bias')).toBeInTheDocument();
    });

    it('renders deviation percentage', () => {
        render(<BiasInsight metadata={baseMetadata} />);

        expect(screen.getByText('50% deviation')).toBeInTheDocument();
        expect(screen.getByText('from expected')).toBeInTheDocument();
    });

    it('renders affected districts', () => {
        render(<BiasInsight metadata={baseMetadata} />);

        expect(screen.getByText('Affected:')).toBeInTheDocument();
        expect(screen.getByText('District 03')).toBeInTheDocument();
        expect(screen.getByText('District 04')).toBeInTheDocument();
    });

    it('applies red color for high deviation', () => {
        const highDeviation: ConsistencyCheckMetadata = {
            ...baseMetadata,
            deviation_percentage: 50,
        };

        render(<BiasInsight metadata={highDeviation} />);

        const deviationText = screen.getByText('50% deviation');
        expect(deviationText).toHaveClass('text-red-400');
    });

    it('applies yellow color for medium deviation', () => {
        const mediumDeviation: ConsistencyCheckMetadata = {
            ...baseMetadata,
            deviation_percentage: 20,
        };

        render(<BiasInsight metadata={mediumDeviation} />);

        const deviationText = screen.getByText('20% deviation');
        expect(deviationText).toHaveClass('text-yellow-400');
    });

    it('applies green color for low deviation', () => {
        const lowDeviation: ConsistencyCheckMetadata = {
            ...baseMetadata,
            deviation_percentage: 10,
        };

        render(<BiasInsight metadata={lowDeviation} />);

        const deviationText = screen.getByText('10% deviation');
        expect(deviationText).toHaveClass('text-green-400');
    });

    it('renders temporal_anomaly check type', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'temporal_anomaly',
            deviation_percentage: 25,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.getByText('Temporal Anomaly')).toBeInTheDocument();
    });

    it('renders geographic_gap check type', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'geographic_gap',
            deviation_percentage: 15,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.getByText('Geographic Gap')).toBeInTheDocument();
    });

    it('does not render deviation when undefined', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'district_bias',
            affected_districts: ['District 01'],
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.queryByText(/deviation/)).not.toBeInTheDocument();
    });

    it('does not render affected districts when undefined', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'temporal_anomaly',
            deviation_percentage: 30,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.queryByText('Affected:')).not.toBeInTheDocument();
    });

    it('does not render affected districts when empty array', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'district_bias',
            affected_districts: [],
            deviation_percentage: 25,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.queryByText('Affected:')).not.toBeInTheDocument();
    });

    it('has correct test id', () => {
        render(<BiasInsight metadata={baseMetadata} />);

        expect(screen.getByTestId('bias-insight-metadata')).toBeInTheDocument();
    });

    it('rounds deviation percentage', () => {
        const metadata: ConsistencyCheckMetadata = {
            ...baseMetadata,
            deviation_percentage: 33.7,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.getByText('34% deviation')).toBeInTheDocument();
    });

    describe('explanations list', () => {
        it('renders explanations when provided', () => {
            const metadata: ConsistencyCheckMetadata = {
                ...baseMetadata,
                explanations: [
                    'Trail network differs between districts',
                    'Recent storm caused localized damage',
                ],
            };

            render(<BiasInsight metadata={metadata} />);

            expect(screen.getByText('Possible causes:')).toBeInTheDocument();
            expect(screen.getByText('Trail network differs between districts')).toBeInTheDocument();
            expect(screen.getByText('Recent storm caused localized damage')).toBeInTheDocument();
        });

        it('renders explanations as bulleted list', () => {
            const metadata: ConsistencyCheckMetadata = {
                ...baseMetadata,
                explanations: ['Reason one', 'Reason two'],
            };

            render(<BiasInsight metadata={metadata} />);

            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list.querySelectorAll('li')).toHaveLength(2);
        });

        it('does not render explanations section when undefined', () => {
            const metadata: ConsistencyCheckMetadata = {
                check_type: 'district_bias',
                deviation_percentage: 20,
            };

            render(<BiasInsight metadata={metadata} />);

            expect(screen.queryByText('Possible causes:')).not.toBeInTheDocument();
        });

        it('does not render explanations section when empty array', () => {
            const metadata: ConsistencyCheckMetadata = {
                ...baseMetadata,
                explanations: [],
            };

            render(<BiasInsight metadata={metadata} />);

            expect(screen.queryByText('Possible causes:')).not.toBeInTheDocument();
        });
    });

    describe('action buttons', () => {
        it('renders all action buttons when callbacks provided', () => {
            const onViewCoverageMap = vi.fn();
            const onAcknowledge = vi.fn();
            const onDismiss = vi.fn();

            render(
                <BiasInsight
                    metadata={baseMetadata}
                    onViewCoverageMap={onViewCoverageMap}
                    onAcknowledge={onAcknowledge}
                    onDismiss={onDismiss}
                />
            );

            expect(screen.getByRole('button', { name: /view coverage map/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /acknowledge/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
        });

        it('calls onViewCoverageMap when clicked', () => {
            const onViewCoverageMap = vi.fn();

            render(
                <BiasInsight
                    metadata={baseMetadata}
                    onViewCoverageMap={onViewCoverageMap}
                />
            );

            fireEvent.click(screen.getByRole('button', { name: /view coverage map/i }));
            expect(onViewCoverageMap).toHaveBeenCalledTimes(1);
        });

        it('calls onAcknowledge when clicked', () => {
            const onAcknowledge = vi.fn();

            render(
                <BiasInsight
                    metadata={baseMetadata}
                    onAcknowledge={onAcknowledge}
                />
            );

            fireEvent.click(screen.getByRole('button', { name: /acknowledge/i }));
            expect(onAcknowledge).toHaveBeenCalledTimes(1);
        });

        it('calls onDismiss when clicked', () => {
            const onDismiss = vi.fn();

            render(
                <BiasInsight
                    metadata={baseMetadata}
                    onDismiss={onDismiss}
                />
            );

            fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
            expect(onDismiss).toHaveBeenCalledTimes(1);
        });

        it('does not render action buttons when no callbacks provided', () => {
            render(<BiasInsight metadata={baseMetadata} />);

            expect(screen.queryByRole('button', { name: /view coverage map/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /acknowledge/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
        });

        it('renders only provided action buttons', () => {
            const onAcknowledge = vi.fn();

            render(
                <BiasInsight
                    metadata={baseMetadata}
                    onAcknowledge={onAcknowledge}
                />
            );

            expect(screen.queryByRole('button', { name: /view coverage map/i })).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: /acknowledge/i })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
        });
    });

    describe('yellow alert card styling', () => {
        it('renders with yellow alert card styling when showAlert is true', () => {
            render(<BiasInsight metadata={baseMetadata} showAlert />);

            const container = screen.getByTestId('bias-insight-metadata');
            expect(container).toHaveClass('border-yellow-500');
            expect(container).toHaveClass('bg-yellow-500/10');
        });

        it('renders warning icon in alert mode', () => {
            render(<BiasInsight metadata={baseMetadata} showAlert />);

            const warningIcon = screen.getByTestId('bias-alert-warning-icon');
            expect(warningIcon).toBeInTheDocument();
        });

        it('renders alert header text in alert mode', () => {
            render(<BiasInsight metadata={baseMetadata} showAlert />);

            expect(screen.getByText('Consistency Alert')).toBeInTheDocument();
        });

        it('does not render alert styling when showAlert is false', () => {
            render(<BiasInsight metadata={baseMetadata} />);

            const container = screen.getByTestId('bias-insight-metadata');
            expect(container).not.toHaveClass('border-yellow-500');
        });

        it('does not render warning icon when not in alert mode', () => {
            render(<BiasInsight metadata={baseMetadata} />);

            expect(screen.queryByTestId('bias-alert-warning-icon')).not.toBeInTheDocument();
        });
    });
});
