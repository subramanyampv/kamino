package net.ngeor.t3.models;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by ngeor on 2/7/2017.
 */
public class PlayerAssignmentTest {
    @Test
    public void getPlayerTypeShouldReturnHumanForX() {
        PlayerAssignment playerAssignment = new PlayerAssignment();
        PlayerType playerType = playerAssignment.getPlayerType(Player.X);
        assertEquals(PlayerType.HUMAN, playerType);
    }

    @Test
    public void getPlayerTypeShouldReturnCPUForO() {
        PlayerAssignment playerAssignment = new PlayerAssignment();
        PlayerType playerType = playerAssignment.getPlayerType(Player.O);
        assertEquals(PlayerType.CPU, playerType);
    }
}
