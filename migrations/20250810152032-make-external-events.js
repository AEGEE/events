module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn(
            'events',
            'organizing_bodies',
            { type: Sequelize.JSONB, allowNull: true }
        );
        await queryInterface.addColumn(
            'events',
            'is_external_event',
            { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
        );
        await queryInterface.addColumn(
            'events',
            'external_organisers',
            { type: Sequelize.STRING, allowNull: true }
        );
        await queryInterface.addColumn(
            'events',
            'external_application_url',
            { type: Sequelize.STRING, allowNull: true }
        );
    },
    down: async (queryInterface) => {
        await queryInterface.changeColumn(
            'events',
            'organizing_bodies',
            { type: Sequelize.JSONB, allowNull: false }
        );
        await queryInterface.removeColumn('events', 'is_external_event');
        await queryInterface.removeColumn('events', 'external_organisers');
        await queryInterface.removeColumn('events', 'external_application_url');
    }
};
