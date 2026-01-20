import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DistrictSelector } from './DistrictSelector';
import type { District, DistrictSuggestion } from '../../types/district';

expect.extend(toHaveNoViolations);

const mockDistricts: District[] = [
    { id: 'district-01', name: 'Mt. Adams Ranger District', number: 1 },
    { id: 'district-02', name: 'Cowlitz Valley Ranger District', number: 2 },
    { id: 'district-03', name: 'Mt. St. Helens National Volcanic Monument', number: 3 },
];

const mockSuggestion: DistrictSuggestion = {
    district_id: 'district-01',
    reason: 'Most reports are located in this district',
    matching_reports: 3,
};

describe('DistrictSelector', () => {
    it('renders with districts', () => {
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId={null}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByTestId('district-selector')).toBeInTheDocument();
        expect(screen.getByText('Select a district...')).toBeInTheDocument();
    });

    it('shows all districts in dropdown', () => {
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId={null}
                onSelect={vi.fn()}
            />
        );

        const select = screen.getByTestId('district-selector');
        expect(select).toHaveTextContent('Mt. Adams Ranger District');
        expect(select).toHaveTextContent('Cowlitz Valley Ranger District');
        expect(select).toHaveTextContent('Mt. St. Helens National Volcanic Monument');
    });

    it('displays suggestion when provided', () => {
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId={null}
                onSelect={vi.fn()}
                suggestion={mockSuggestion}
            />
        );

        const suggestion = screen.getByTestId('district-suggestion');
        expect(suggestion).toBeInTheDocument();
        expect(suggestion).toHaveTextContent('Suggested: Mt. Adams Ranger District');
        expect(suggestion).toHaveTextContent('3 reports match');
    });

    it('marks suggested option in dropdown', () => {
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId={null}
                onSelect={vi.fn()}
                suggestion={mockSuggestion}
            />
        );

        const select = screen.getByTestId('district-selector');
        expect(select).toHaveTextContent('Mt. Adams Ranger District (Suggested)');
    });

    it('calls onSelect when selection changes', () => {
        const onSelect = vi.fn();
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId={null}
                onSelect={onSelect}
            />
        );

        const select = screen.getByTestId('district-selector');
        fireEvent.change(select, { target: { value: 'district-02' } });

        expect(onSelect).toHaveBeenCalledWith('district-02');
    });

    it('calls onSelect with null when cleared', () => {
        const onSelect = vi.fn();
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId="district-01"
                onSelect={onSelect}
            />
        );

        const select = screen.getByTestId('district-selector');
        fireEvent.change(select, { target: { value: '' } });

        expect(onSelect).toHaveBeenCalledWith(null);
    });

    it('shows selected value', () => {
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId="district-02"
                onSelect={vi.fn()}
            />
        );

        const select = screen.getByTestId('district-selector') as HTMLSelectElement;
        expect(select.value).toBe('district-02');
    });

    it('disables when disabled prop is true', () => {
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId={null}
                onSelect={vi.fn()}
                disabled
            />
        );

        const select = screen.getByTestId('district-selector');
        expect(select).toBeDisabled();
    });

    it('disables when loading', () => {
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId={null}
                onSelect={vi.fn()}
                isLoading
            />
        );

        const select = screen.getByTestId('district-selector');
        expect(select).toBeDisabled();
    });

    it('has no accessibility violations', async () => {
        const { container } = render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId={null}
                onSelect={vi.fn()}
                suggestion={mockSuggestion}
            />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('has proper label association', () => {
        render(
            <DistrictSelector
                districts={mockDistricts}
                selectedDistrictId={null}
                onSelect={vi.fn()}
            />
        );

        const label = screen.getByText('District');
        const select = screen.getByTestId('district-selector');
        expect(label).toHaveAttribute('for', select.id);
    });
});
